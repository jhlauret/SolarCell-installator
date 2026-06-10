# -*- coding: utf-8 -*-
"""
Controller SSO « deep-link » à ajouter au module Odoo `solarcell_installer_onboarding`.

Flux :
  Front (bouton Module 3)
    -> BFF GET /api/learning/odoo-sso?applicationId=…&course=…
       (le BFF résout l'email, signe un jeton HMAC court, puis 302)
    -> Odoo GET /solar/sso/login?token=<payload>.<signature>
       (ce controller vérifie le jeton, ouvre une session portail, puis 302 vers le cours)

Sécurité :
  - Le jeton est signé HMAC-SHA256 avec la clé interne partagée
    (paramètre système `solarcell.internal_api_key`, = ODOO_API_KEY côté BFF).
  - Durée de vie courte (champ `exp`, ~60 s) → rejouabilité minimale.
  - `redirect` est inclus DANS le jeton signé (anti open-redirect / tampering) et
    re-validé ici contre une liste blanche de préfixes.

Cible : Odoo 18 (compatible 17). La pose de session « sans mot de passe » utilise
`request.session` + `request.update_env`, pattern valide sur Odoo 17/18.
"""

import base64
import hashlib
import hmac
import json
import time

from odoo import http
from odoo.http import request

# Préfixes de redirection autorisés (défense en profondeur, en plus du jeton signé).
_ALLOWED_REDIRECT_PREFIXES = ("/slides/",)


def _b64url_decode(data: str) -> bytes:
    pad = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + pad)


def _verify_token(token: str, secret: str):
    """Renvoie le payload (dict) si le jeton est valide et non expiré, sinon None."""
    try:
        body, sig = token.split(".", 1)
    except ValueError:
        return None

    expected = base64.urlsafe_b64encode(
        hmac.new(secret.encode(), body.encode(), hashlib.sha256).digest()
    ).rstrip(b"=").decode()

    # Comparaison à temps constant.
    if not hmac.compare_digest(sig, expected):
        return None

    try:
        payload = json.loads(_b64url_decode(body))
    except Exception:
        return None

    if not isinstance(payload, dict):
        return None
    if int(payload.get("exp", 0)) < int(time.time()):
        return None
    return payload


class SolarSsoController(http.Controller):

    @http.route("/solar/sso/login", type="http", auth="public", website=True, csrf=False)
    def solar_sso_login(self, token=None, **kw):
        if not token:
            return request.redirect("/web/login")

        secret = (
            request.env["ir.config_parameter"]
            .sudo()
            .get_param("solarcell.internal_api_key")
        )
        if not secret:
            return request.redirect("/web/login")

        payload = _verify_token(token, secret)
        if not payload:
            return request.redirect("/web/login")

        email = (payload.get("email") or "").strip().lower()
        redirect = payload.get("redirect") or "/slides"
        if not email or not redirect.startswith(_ALLOWED_REDIRECT_PREFIXES):
            return request.redirect("/web/login")

        # Retrouve (ou crée) l'utilisateur portail lié à l'email.
        user = (
            request.env["res.users"]
            .sudo()
            .search([("login", "=", email)], limit=1)
        )
        if not user:
            user = (
                request.env["res.users"]
                .sudo()
                .search([("email", "=", email)], limit=1)
            )
        if not user:
            user = self._provision_portal_user(email)
        if not user:
            return request.redirect("/web/login")

        self._login_session(user)
        return request.redirect(redirect)

    # --- helpers ----------------------------------------------------------------

    def _provision_portal_user(self, email):
        """Crée un utilisateur portail minimal si l'installateur n'en a pas encore."""
        portal_group = request.env.ref("base.group_portal", raise_if_not_found=False)
        if not portal_group:
            return False
        return (
            request.env["res.users"]
            .sudo()
            .with_context(no_reset_password=True)
            .create(
                {
                    "name": email,
                    "login": email,
                    "email": email,
                    "groups_id": [(6, 0, [portal_group.id])],
                }
            )
        )

    def _login_session(self, user):
        """
        Ouvre une session pour `user` sans mot de passe (controller de confiance).
        Pattern Odoo 17/18 : on renseigne la session puis on bascule l'environnement.
        """
        session = request.session
        session.uid = user.id
        session.login = user.login
        # Jeton lié au mot de passe : la session devient invalide si le mdp change.
        session.session_token = user._compute_session_token(session.sid)
        session.context = dict(session.context or {})
        session.context["lang"] = user.lang or "fr_FR"
        if user.tz:
            session.context["tz"] = user.tz
        # Bascule l'env du request sur l'utilisateur connecté (Odoo 16+).
        request.update_env(user=user.id, context=session.context)
