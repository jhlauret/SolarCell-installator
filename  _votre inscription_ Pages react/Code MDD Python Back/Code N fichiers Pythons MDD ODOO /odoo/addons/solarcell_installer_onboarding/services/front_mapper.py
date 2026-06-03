# -*- coding: utf-8 -*-
"""Front-end JSON -> Odoo model mapper for the SolarCell installer onboarding.

This file is intentionally independent from the HTTP controller. It can be unit-tested
and reused by cron jobs, imports, a Node.js BFF, or another API layer.
"""
import json
import re
from datetime import datetime
from typing import Any, Dict, Optional

from odoo import fields
from odoo.exceptions import UserError, ValidationError


LEVEL_MAP = {
    "debutant": "beginner",
    "débutant": "beginner",
    "beginner": "beginner",
    "intermediaire": "intermediate",
    "intermédiaire": "intermediate",
    "intermediate": "intermediate",
    "avance": "advanced",
    "avancé": "advanced",
    "advanced": "advanced",
    "expert": "expert",
}

STRUCTURE_MAP = {
    "ei": "sole_trader",
    "entreprise_individuelle": "sole_trader",
    "sole_trader": "sole_trader",
    "company": "company",
    "societe": "company",
    "société": "company",
    "freelance": "freelance",
    "association": "association",
    "other": "other",
    "autre": "other",
}

EMPLOYEE_RANGE_MAP = {
    "0": "0",
    "aucun": "0",
    "1_5": "1_5",
    "1 à 5": "1_5",
    "1-5": "1_5",
    "6_20": "6_20",
    "6 à 20": "6_20",
    "6-20": "6_20",
    "21_50": "21_50",
    "21 à 50": "21_50",
    "21-50": "21_50",
    "50_plus": "50_plus",
    "50+": "50_plus",
}

EXPERIENCE_MAP = {
    "1_3": "1_3",
    "1 à 3 ans": "1_3",
    "1-3": "1_3",
    "3_5": "3_5",
    "3 à 5 ans": "3_5",
    "3-5": "3_5",
    "5_plus": "5_plus",
    "plus de 5 ans": "5_plus",
    "5+": "5_plus",
}

INSTALLATIONS_MAP = {
    "1_10": "1_10",
    "1 à 10": "1_10",
    "1-10": "1_10",
    "10_50": "10_50",
    "10 à 50": "10_50",
    "10-50": "10_50",
    "50_plus": "50_plus",
    "50+": "50_plus",
}

WALLET_TYPE_MAP = {
    "integrated": "integrated",
    "solarcell_integrated": "integrated",
    "wallet_solarcell_integre": "integrated",
    "wallet solarcell intégré": "integrated",
    "external": "external",
    "wallet_externe": "external",
    "wallet externe": "external",
}

NETWORK_MAP = {
    "solarcell": "solarcell",
    "slc": "solarcell",
    "polygon": "polygon",
    "ethereum": "ethereum",
    "eth": "ethereum",
}

LANG_MAP = {
    "fr": "fr_FR",
    "fr_fr": "fr_FR",
    "french": "fr_FR",
    "français": "fr_FR",
    "en": "en_US",
    "en_us": "en_US",
    "english": "en_US",
}

TZ_MAP = {
    "paris": "Europe/Paris",
    "europe/paris": "Europe/Paris",
    "brussels": "Europe/Brussels",
    "utc": "UTC",
}


def _norm(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def _norm_key(value: Any) -> str:
    return _norm(value).lower().replace(" ", "_").replace("-", "_")


def _pick(data: Dict[str, Any], *keys: str, default: Any = None) -> Any:
    for key in keys:
        if key in data and data[key] not in (None, ""):
            return data[key]
    return default


def _digits(value: Any) -> str:
    return re.sub(r"\D+", "", _norm(value))


def _parse_date(value: Any):
    raw = _norm(value)
    if not raw:
        return False
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%d.%m.%Y"):
        try:
            return datetime.strptime(raw, fmt).date().isoformat()
        except ValueError:
            pass
    raise ValidationError(f"Date invalide: {raw}. Formats acceptés: YYYY-MM-DD ou JJ/MM/AAAA.")


def _find_country(env, value: Any):
    raw = _norm(value)
    if not raw:
        return False
    Country = env["res.country"].sudo()
    if len(raw) in (2, 3):
        country = Country.search(["|", ("code", "=ilike", raw), ("name", "=ilike", raw)], limit=1)
    else:
        country = Country.search([("name", "=ilike", raw)], limit=1)
    return country.id if country else False


def _map_selection(mapping: Dict[str, str], value: Any, field_name: str, required=False) -> Optional[str]:
    raw = _norm(value)
    if not raw:
        if required:
            raise ValidationError(f"Champ obligatoire manquant: {field_name}")
        return False
    direct = mapping.get(raw) or mapping.get(raw.lower()) or mapping.get(_norm_key(raw))
    if not direct:
        raise ValidationError(f"Valeur non supportée pour {field_name}: {raw}")
    return direct


def _map_lang(value: Any) -> Optional[str]:
    raw = _norm(value)
    if not raw:
        return False
    return LANG_MAP.get(raw.lower()) or LANG_MAP.get(_norm_key(raw)) or raw


def _map_tz(value: Any) -> Optional[str]:
    raw = _norm(value)
    if not raw:
        return False
    return TZ_MAP.get(raw.lower()) or TZ_MAP.get(_norm_key(raw)) or raw


class SolarOnboardingFrontMapper:
    """Mapping service used by Odoo controllers.

    Expected front payload shape. The service also accepts several aliases to keep
    compatibility with React forms where names evolve over time.

    {
      "personal": {...},
      "professional": {...},
      "skills": {...},
      "documents": [...],
      "training": [...],
      "contract": {...},
      "wallet": {...}
    }
    """

    def __init__(self, env, user=None, ip_address=None, user_agent=None):
        self.env = env
        self.user = user or env.user
        self.ip_address = ip_address
        self.user_agent = user_agent

    def start_or_update(self, payload: Dict[str, Any], application_id: Optional[int] = None):
        if not payload:
            raise UserError("Payload vide.")
        app = self._get_or_create_application(payload, application_id=application_id)
        for step in ("personal", "professional", "skills", "training", "contract", "wallet"):
            if step in payload:
                self.save_step(app, step, payload[step])
        return app

    def save_step(self, application, step: str, data: Any):
        if step == "personal":
            self._save_personal(application, data or {})
        elif step == "professional":
            self._save_professional(application, data or {})
        elif step == "skills":
            self._save_skills(application, data or {})
        elif step == "training":
            self._save_training(application, data or [])
        elif step == "contract":
            self._save_contract(application, data or {})
        elif step == "wallet":
            self._save_wallet(application, data or {})
        elif step == "documents":
            # document binary uploads are handled by upload_document(); metadata can still be audited here
            application.write({"current_step": "documents", "kyc_status": "pending", "kyb_status": "pending"})
        else:
            raise UserError(f"Étape non supportée: {step}")
        self._audit(application, f"save_{step}", step, data)
        return application

    def upload_document(self, application, requirement_code: str, attachment, checksum=None, expiry_date=None):
        req = self.env["solar.document.requirement"].sudo().search([("code", "=", requirement_code)], limit=1)
        if not req:
            raise UserError(f"Type de document inconnu: {requirement_code}")
        doc = self.env["solar.installer.document"].sudo().create({
            "application_id": application.id,
            "requirement_id": req.id,
            "attachment_id": attachment.id,
            "status": "uploaded",
            "checksum": checksum,
            "expiry_date": _parse_date(expiry_date) if expiry_date else False,
        })
        status_vals = {"kyc_status": "under_review"} if req.document_scope == "kyc" else {"kyb_status": "under_review"}
        application.sudo().write({"current_step": "documents", **status_vals})
        self._audit(application, "upload_document", "documents", {"requirement_code": requirement_code, "attachment_id": attachment.id})
        return doc

    def _get_or_create_application(self, payload: Dict[str, Any], application_id: Optional[int] = None):
        Application = self.env["solar.installer.application"].sudo()
        if application_id:
            app = Application.browse(application_id).exists()
            if not app:
                raise UserError(f"Application introuvable: {application_id}")
            return app

        personal = payload.get("personal") or payload
        email = _pick(personal, "email", "emailAddress", "adresseEmail")
        partner = None
        if email:
            partner = self.env["res.partner"].sudo().search([("email", "=ilike", email)], limit=1)
        if not partner:
            name = self._build_partner_name(personal) or email or "SolarCell candidate"
            partner = self.env["res.partner"].sudo().create({
                "name": name,
                "email": email,
                "solar_is_installer_candidate": True,
            })
        partner.write({"solar_is_installer_candidate": True})
        app = Application.search([("partner_id", "=", partner.id), ("current_step", "not in", ["approved", "rejected"])], limit=1)
        if app:
            return app
        return Application.create({"partner_id": partner.id, "user_id": self.user.id if self.user and not self.user._is_public() else False})

    def _build_partner_name(self, data: Dict[str, Any]) -> str:
        first_name = _pick(data, "firstName", "firstname", "prenom", "prénom")
        last_name = _pick(data, "lastName", "lastname", "nom")
        return " ".join(part for part in [first_name, last_name] if part)

    def _save_personal(self, app, data: Dict[str, Any]):
        first_name = _pick(data, "firstName", "firstname", "prenom", "prénom")
        last_name = _pick(data, "lastName", "lastname", "nom")
        email = _pick(data, "email", "emailAddress", "adresseEmail")
        phone = _pick(data, "phone", "phoneNumber", "telephone", "téléphone")
        country = _pick(data, "country", "pays")
        lang = _pick(data, "language", "preferredLanguage", "languePreferee", "languePréférée")
        tz = _pick(data, "timezone", "timeZone", "fuseauHoraire")

        partner_vals = {
            "name": self._build_partner_name(data) or app.partner_id.name,
            "email": email or app.partner_id.email,
            "phone": phone or app.partner_id.phone,
            "street": _pick(data, "street", "address", "adresse") or app.partner_id.street,
            "zip": _pick(data, "zip", "postalCode", "codePostal") or app.partner_id.zip,
            "city": _pick(data, "city", "ville") or app.partner_id.city,
            "country_id": _find_country(self.env, country) or app.partner_id.country_id.id,
            "lang": _map_lang(lang) or app.partner_id.lang,
            "solar_birthdate": _parse_date(_pick(data, "birthDate", "dateOfBirth", "dateNaissance")) or app.partner_id.solar_birthdate,
            "solar_birth_country_id": _find_country(self.env, _pick(data, "birthCountry", "paysNaissance")) or app.partner_id.solar_birth_country_id.id,
            "solar_nationality_id": _find_country(self.env, _pick(data, "nationality", "nationalite", "nationalité")) or app.partner_id.solar_nationality_id.id,
            "solar_is_installer_candidate": True,
        }
        app.partner_id.sudo().write({k: v for k, v in partner_vals.items() if v not in (None, "")})

        if app.user_id and tz:
            app.user_id.sudo().write({"tz": _map_tz(tz)})

        privacy_accepted = bool(_pick(data, "privacyAccepted", "rgpdAccepted", "privacy_accepted", default=False))
        app_vals = {"current_step": "personal"}
        if privacy_accepted:
            app_vals.update({
                "privacy_accepted": True,
                "privacy_accepted_at": fields.Datetime.now(),
                "privacy_accepted_ip": self.ip_address,
            })
        app.sudo().write(app_vals)

    def _save_professional(self, app, data: Dict[str, Any]):
        company_name = _pick(data, "companyName", "legalName", "raisonSociale", "nomEntreprise")
        if not company_name:
            raise ValidationError("Nom de l’entreprise / raison sociale manquant.")
        siret = _digits(_pick(data, "siret", "numeroSiret", "numéroSIRET"))
        vat = _pick(data, "vat", "tva", "vatNumber", "numeroTva")
        country = _pick(data, "country", "pays")

        Partner = self.env["res.partner"].sudo()
        company = app.company_partner_id
        if not company and siret:
            company = Partner.search([("solar_siret", "=", siret)], limit=1)
        if not company:
            company = Partner.create({"name": company_name, "is_company": True, "company_type": "company"})

        company_vals = {
            "name": company_name,
            "is_company": True,
            "company_type": "company",
            "street": _pick(data, "street", "address", "adresseProfessionnelle") or company.street,
            "zip": _pick(data, "zip", "postalCode", "codePostal") or company.zip,
            "city": _pick(data, "city", "ville") or company.city,
            "country_id": _find_country(self.env, country) or company.country_id.id,
            "phone": _pick(data, "phone", "professionalPhone", "telephoneProfessionnel") or company.phone,
            "email": _pick(data, "email", "professionalEmail", "emailProfessionnel") or company.email,
            "vat": vat or company.vat,
            "solar_structure_type": _map_selection(STRUCTURE_MAP, _pick(data, "structureType", "typeStructure"), "type de structure") or company.solar_structure_type,
            "solar_siret": siret or company.solar_siret,
            "solar_ape_naf": _pick(data, "apeNaf", "ape", "naf", "codeApeNaf") or company.solar_ape_naf,
            "solar_creation_year": int(_pick(data, "creationYear", "anneeCreation", default=0) or 0) or company.solar_creation_year,
            "solar_employee_range": _map_selection(EMPLOYEE_RANGE_MAP, _pick(data, "employeeRange", "employeeCount", "nombreSalaries"), "nombre de salariés") or company.solar_employee_range,
            "solar_main_activity": _pick(data, "mainActivity", "activitePrincipale", "activitéPrincipale") or company.solar_main_activity,
        }
        company.write({k: v for k, v in company_vals.items() if v not in (None, "")})
        app.partner_id.sudo().write({"parent_id": company.id})
        app.sudo().write({"company_partner_id": company.id, "current_step": "professional"})

    def _save_skills(self, app, data: Dict[str, Any]):
        skill_items = data.get("items") or data.get("skills") or []
        years_experience = _map_selection(EXPERIENCE_MAP, _pick(data, "yearsExperience", "experienceYears", "anneesExperience"), "années d’expérience")
        installations_range = _map_selection(INSTALLATIONS_MAP, _pick(data, "installationsRange", "installationsCount", "nombreInstallations"), "nombre d’installations")

        Skill = self.env["solar.skill"].sudo()
        Line = self.env["solar.installer.skill.line"].sudo()
        for item in skill_items:
            code = _norm_key(_pick(item, "code", "id", "label", "name"))
            label = _pick(item, "label", "name", default=code)
            level = _map_selection(LEVEL_MAP, _pick(item, "level", "declaredLevel", "niveau"), "niveau", required=True)
            skill = Skill.search([("code", "=", code)], limit=1)
            if not skill:
                skill = Skill.create({"name": label, "code": code})
            line = Line.search([("application_id", "=", app.id), ("skill_id", "=", skill.id)], limit=1)
            vals = {
                "application_id": app.id,
                "skill_id": skill.id,
                "declared_level": level,
                "years_experience": years_experience,
                "installations_range": installations_range,
            }
            if line:
                line.write(vals)
            else:
                Line.create(vals)
        app.sudo().write({"current_step": "skills"})

    def _save_training(self, app, items):
        if isinstance(items, dict):
            items = items.get("courses") or []
        Course = self.env["solar.training.course"].sudo()
        Progress = self.env["solar.training.progress"].sudo()
        for item in items:
            code = _norm_key(_pick(item, "code", "id", "title", "name"))
            name = _pick(item, "title", "name", default=code)
            progress = float(_pick(item, "progress", "progressPercent", default=0) or 0)
            status = _pick(item, "status", default="completed" if progress >= 100 else "in_progress" if progress > 0 else "not_started")
            course = Course.search([("code", "=", code)], limit=1) or Course.create({"name": name, "code": code})
            rec = Progress.search([("application_id", "=", app.id), ("course_id", "=", course.id)], limit=1)
            vals = {
                "application_id": app.id,
                "course_id": course.id,
                "progress_percent": min(max(progress, 0), 100),
                "status": status,
                "started_at": fields.Datetime.now() if status in ("in_progress", "completed") else False,
                "completed_at": fields.Datetime.now() if status == "completed" else False,
                "score": float(_pick(item, "score", default=0) or 0),
            }
            if rec:
                rec.write(vals)
            else:
                Progress.create(vals)
        training_status = "approved" if items and all(float(_pick(i, "progress", "progressPercent", default=0) or 0) >= 100 for i in items) else "pending"
        app.sudo().write({"current_step": "training", "training_status": training_status})

    def _save_contract(self, app, data: Dict[str, Any]):
        Contract = self.env["solar.installer.contract"].sudo()
        contract = Contract.search([("application_id", "=", app.id), ("status", "not in", ["cancelled"])], limit=1)
        accepted = bool(_pick(data, "acceptedTerms", "accepted", "termsAccepted", default=False))
        vals = {
            "application_id": app.id,
            "version": _pick(data, "version", default="1.0"),
            "status": "accepted" if accepted else "generated",
            "accepted_terms": accepted,
            "accepted_at": fields.Datetime.now() if accepted else False,
            "accepted_ip": self.ip_address,
            "accepted_user_agent": self.user_agent,
            "signature_provider": _pick(data, "signatureProvider", default="none"),
            "provider_envelope_id": _pick(data, "providerEnvelopeId", "envelopeId"),
        }
        if contract:
            contract.write(vals)
        else:
            contract = Contract.create(vals)
        app.sudo().write({"current_step": "contract", "contract_status": "approved" if accepted else "pending"})
        return contract

    def _save_wallet(self, app, data: Dict[str, Any]):
        Wallet = self.env["solar.wallet"].sudo()
        wallet_type = _map_selection(WALLET_TYPE_MAP, _pick(data, "walletType", "method", default="integrated"), "wallet type", required=True)
        network = _map_selection(NETWORK_MAP, _pick(data, "network", default="solarcell"), "network") or "solarcell"
        wallet = Wallet.search([("application_id", "=", app.id), ("status", "!=", "closed")], limit=1)
        recovery_confirmed = bool(_pick(data, "recoveryConfirmed", "recoveryPhraseConfirmed", default=False))
        vals = {
            "application_id": app.id,
            "wallet_type": wallet_type,
            "custody_type": "custodial" if wallet_type == "integrated" else "non_custodial",
            "network": network,
            "public_address": _pick(data, "publicAddress", "address"),
            "provider_ref": _pick(data, "providerRef"),
            "recovery_confirmed": recovery_confirmed,
            "recovery_confirmed_at": fields.Datetime.now() if recovery_confirmed else False,
            "status": "active" if recovery_confirmed or wallet_type == "external" else "pending",
            "activated_at": fields.Datetime.now() if recovery_confirmed or wallet_type == "external" else False,
        }
        if wallet:
            wallet.write({k: v for k, v in vals.items() if v not in (None, "")})
        else:
            wallet = Wallet.create({k: v for k, v in vals.items() if v not in (None, "")})
        app.sudo().write({"current_step": "wallet", "wallet_status": "approved" if wallet.status == "active" else "pending"})
        return wallet

    def _audit(self, app, event_type: str, step: str, payload: Any):
        try:
            payload_json = json.dumps(payload, ensure_ascii=False, default=str)[:65000]
        except Exception:
            payload_json = "{}"
        self.env["solar.onboarding.audit.event"].sudo().create({
            "application_id": app.id,
            "event_type": event_type,
            "step": step,
            "payload_json": payload_json,
            "actor_user_id": self.user.id if self.user and not self.user._is_public() else False,
            "ip_address": self.ip_address,
            "user_agent": self.user_agent,
        })
