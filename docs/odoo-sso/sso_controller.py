import base64
import hashlib
import hmac
import json
import logging
import time

from odoo import http
from odoo.http import request

_logger = logging.getLogger(__name__)

# Préfixes de redirection "deep-link" autorisés (défense en profondeur, en plus
# de la signature du jeton). Toute valeur de `redirect` hors de ces préfixes
# est ignorée et on retombe sur /my ou /odoo.
_ALLOWED_REDIRECT_PREFIXES = ("/slides/",)


class OdooSsoController(http.Controller):
    """
    SSO "1 clic" : le BFF Node.js génère un jeton signé (HMAC,
    clé partagée `solarcell.internal_api_key`) pour un installateur déjà
    authentifié côté webapp, et redirige le navigateur ici. Ce contrôleur
    vérifie le jeton et ouvre une session Odoo (portail) sans mot de passe.

    Deux usages :
      - Espace Odoo générique (jeton `{email, exp}`) → redirection vers
        `/my` (portail) ou `/odoo` (interne).
      - Deep-link "Module 3" Odoo Learning (jeton `{email, exp, redirect}`,
        `redirect` préfixé par `/slides/`) → redirection directe vers le cours.
    """

    @http.route(
        '/solar/sso/login',
        type='http',
        auth='public',
        methods=['GET'],
        csrf=False,
    )
    def sso_login(self, token=None, **kwargs):
        try:
            return self._handle_sso(token)
        except Exception:
            _logger.exception('Erreur inattendue dans /solar/sso/login.')
            return request.redirect('/web/login?error=sso_failed')

    def _handle_sso(self, token):
        secret = (
            request.env['ir.config_parameter']
            .sudo()
            .get_param('solarcell.internal_api_key', '')
        )
        if not secret:
            _logger.error('solarcell.internal_api_key non configurée.')
            return request.redirect('/web/login?error=sso_failed')

        # --- 1. Format du jeton : <payload_b64url>.<hmac_hex> ---
        if not token or '.' not in token:
            return request.redirect('/web/login?error=invalid_sso')

        payload_b64, _, signature = token.rpartition('.')
        if not payload_b64 or not signature:
            return request.redirect('/web/login?error=invalid_sso')

        expected_sig = hmac.new(
            secret.encode(), payload_b64.encode(), hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(signature, expected_sig):
            _logger.warning('Jeton SSO avec signature invalide.')
            return request.redirect('/web/login?error=invalid_sso')

        # --- 2. Décodage et expiration ---
        try:
            padded = payload_b64 + '=' * (-len(payload_b64) % 4)
            payload = json.loads(base64.urlsafe_b64decode(padded.encode()).decode())
            email = (payload.get('email') or '').strip().lower()
            exp = int(payload.get('exp', 0))
            redirect_to = payload.get('redirect') or None
        except Exception:
            return request.redirect('/web/login?error=invalid_sso')

        if not email:
            return request.redirect('/web/login?error=invalid_sso')
        if exp < int(time.time()):
            return request.redirect('/web/login?error=expired_sso')

        if redirect_to and not redirect_to.startswith(_ALLOWED_REDIRECT_PREFIXES):
            redirect_to = None

        env = request.env

        # --- 3. L'email doit correspondre à un installateur connu ---
        identity = (
            env['solarcell.installer.identity']
            .sudo()
            .search([('email', '=', email)], limit=1)
        )
        if not identity:
            return request.redirect('/web/login?error=unknown_user')

        # --- 4. Trouver ou créer le res.users portail correspondant ---
        user = env['res.users'].sudo().search([('login', '=', email)], limit=1)
        if not user:
            portal_group = env.ref('base.group_portal', raise_if_not_found=False)
            user_vals = {
                'name': identity.name or email,
                'login': email,
                'email': email,
                'partner_id': identity.partner_id.id,
                'groups_id': [(6, 0, [portal_group.id])] if portal_group else False,
                'active': True,
            }
            user = env['res.users'].sudo().create(user_vals)
            env.cr.commit()

        if not user.active:
            return request.redirect('/web/login?error=unknown_user')

        # --- 5. Authentifier la session sans mot de passe (SSO de confiance) ---
        request.session.uid = user.id
        request.session.login = user.login
        request.session.session_token = user._compute_session_token(request.session.sid)
        request.session.context = dict(request.session.context or {})
        if user.lang:
            request.session.context['lang'] = user.lang
        if user.tz:
            request.session.context['tz'] = user.tz
        request.update_env(user=user.id, context=request.session.context)

        # --- 6. Redirection finale ---
        if redirect_to:
            return request.redirect(redirect_to)

        is_internal = user.has_group('base.group_user')
        return request.redirect('/odoo' if is_internal else '/my')
