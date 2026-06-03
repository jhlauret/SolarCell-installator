# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
from odoo.exceptions import ValidationError


APPLICATION_STEPS = [
    ("draft", "Draft"),
    ("personal", "Informations personnelles"),
    ("professional", "Informations professionnelles"),
    ("skills", "Compétences"),
    ("documents", "Documents KYC / KYB"),
    ("training", "Formation"),
    ("contract", "Contrat"),
    ("wallet", "Wallet SolarCell"),
    ("approved", "Approuvée"),
    ("rejected", "Rejetée"),
    ("suspended", "Suspendue"),
]

STATUS = [
    ("not_started", "Non démarré"),
    ("pending", "En attente"),
    ("under_review", "En revue"),
    ("approved", "Approuvé"),
    ("rejected", "Rejeté"),
]

SKILL_LEVELS = [
    ("beginner", "Débutant"),
    ("intermediate", "Intermédiaire"),
    ("advanced", "Avancé"),
    ("expert", "Expert"),
]


class SolarInstallerApplication(models.Model):
    _name = "solar.installer.application"
    _description = "SolarCell installer onboarding application"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "create_date desc, id desc"

    name = fields.Char(default=lambda self: self.env["ir.sequence"].next_by_code("solar.installer.application") or _("New"), copy=False, readonly=True, tracking=True)
    partner_id = fields.Many2one("res.partner", required=True, index=True, tracking=True, ondelete="restrict")
    user_id = fields.Many2one("res.users", string="Portal/User account", ondelete="set null")
    company_partner_id = fields.Many2one("res.partner", string="Professional structure", domain=[("is_company", "=", True)], ondelete="set null")

    current_step = fields.Selection(APPLICATION_STEPS, default="draft", tracking=True, index=True)
    progress_percent = fields.Float(compute="_compute_progress", store=True)
    submitted_at = fields.Datetime(readonly=True)
    approved_at = fields.Datetime(readonly=True)
    approved_by = fields.Many2one("res.users", readonly=True)
    rejection_reason = fields.Text(tracking=True)

    kyc_status = fields.Selection(STATUS, default="not_started", tracking=True)
    kyb_status = fields.Selection(STATUS, default="not_started", tracking=True)
    training_status = fields.Selection(STATUS, default="not_started", tracking=True)
    contract_status = fields.Selection(STATUS, default="not_started", tracking=True)
    wallet_status = fields.Selection(STATUS, default="not_started", tracking=True)

    privacy_accepted = fields.Boolean(string="RGPD accepted")
    privacy_version = fields.Char(default="2026-06")
    privacy_accepted_at = fields.Datetime()
    privacy_accepted_ip = fields.Char()

    skill_line_ids = fields.One2many("solar.installer.skill.line", "application_id")
    document_ids = fields.One2many("solar.installer.document", "application_id")
    training_progress_ids = fields.One2many("solar.training.progress", "application_id")
    contract_ids = fields.One2many("solar.installer.contract", "application_id")
    wallet_ids = fields.One2many("solar.wallet", "application_id")
    audit_event_ids = fields.One2many("solar.onboarding.audit.event", "application_id")

    @api.depends("current_step", "kyc_status", "kyb_status", "training_status", "contract_status", "wallet_status")
    def _compute_progress(self):
        step_scores = {
            "draft": 0,
            "personal": 14,
            "professional": 28,
            "skills": 42,
            "documents": 56,
            "training": 70,
            "contract": 84,
            "wallet": 95,
            "approved": 100,
            "rejected": 0,
            "suspended": 0,
        }
        for rec in self:
            rec.progress_percent = step_scores.get(rec.current_step, 0)

    def action_submit(self):
        for rec in self:
            rec.submitted_at = fields.Datetime.now()
            rec.message_post(body=_("SolarCell onboarding application submitted."))
        return True

    def action_approve(self):
        for rec in self:
            rec.current_step = "approved"
            rec.approved_at = fields.Datetime.now()
            rec.approved_by = self.env.user
            rec.message_post(body=_("SolarCell installer application approved."))
        return True

    def action_reject(self, reason=None):
        for rec in self:
            rec.current_step = "rejected"
            rec.rejection_reason = reason or rec.rejection_reason
            rec.message_post(body=_("SolarCell installer application rejected."))
        return True


class SolarSkill(models.Model):
    _name = "solar.skill"
    _description = "SolarCell skill reference"
    _order = "sequence, name"

    name = fields.Char(required=True, translate=True)
    code = fields.Char(required=True, index=True)
    description = fields.Text(translate=True)
    sequence = fields.Integer(default=10)
    active = fields.Boolean(default=True)

    _sql_constraints = [("code_unique", "unique(code)", "Skill code must be unique.")]


class SolarInstallerSkillLine(models.Model):
    _name = "solar.installer.skill.line"
    _description = "Installer declared/validated skill"
    _order = "application_id, skill_id"

    application_id = fields.Many2one("solar.installer.application", required=True, ondelete="cascade", index=True)
    partner_id = fields.Many2one(related="application_id.partner_id", store=True, readonly=True)
    skill_id = fields.Many2one("solar.skill", required=True, ondelete="restrict")
    declared_level = fields.Selection(SKILL_LEVELS, default="beginner", required=True)
    validated_level = fields.Selection(SKILL_LEVELS)
    validated_by = fields.Many2one("res.users")
    validated_at = fields.Datetime()
    years_experience = fields.Selection([
        ("1_3", "1 à 3 ans"),
        ("3_5", "3 à 5 ans"),
        ("5_plus", "Plus de 5 ans"),
    ])
    installations_range = fields.Selection([
        ("1_10", "1 à 10"),
        ("10_50", "10 à 50"),
        ("50_plus", "50+"),
    ])
    certification_note = fields.Text()

    _sql_constraints = [("uniq_skill_application", "unique(application_id, skill_id)", "Skill already declared for this application.")]


class SolarDocumentRequirement(models.Model):
    _name = "solar.document.requirement"
    _description = "Required KYC/KYB document reference"
    _order = "sequence, name"

    name = fields.Char(required=True, translate=True)
    code = fields.Char(required=True, index=True)
    document_scope = fields.Selection([("kyc", "KYC"), ("kyb", "KYB")], required=True)
    description = fields.Text(translate=True)
    accepted_mimetypes = fields.Char(default="application/pdf,image/jpeg,image/png")
    max_size_mb = fields.Integer(default=10)
    validity_months = fields.Integer(help="0 means no computed expiry.")
    required = fields.Boolean(default=True)
    sequence = fields.Integer(default=10)
    active = fields.Boolean(default=True)

    _sql_constraints = [("code_unique", "unique(code)", "Document requirement code must be unique.")]


class SolarInstallerDocument(models.Model):
    _name = "solar.installer.document"
    _description = "Installer KYC/KYB uploaded document"
    _inherit = ["mail.thread"]
    _order = "create_date desc"

    application_id = fields.Many2one("solar.installer.application", required=True, ondelete="cascade", index=True)
    partner_id = fields.Many2one(related="application_id.partner_id", store=True, readonly=True)
    company_partner_id = fields.Many2one(related="application_id.company_partner_id", store=True, readonly=True)
    requirement_id = fields.Many2one("solar.document.requirement", required=True, ondelete="restrict")
    document_scope = fields.Selection(related="requirement_id.document_scope", store=True, readonly=True)
    attachment_id = fields.Many2one("ir.attachment", required=True, ondelete="restrict")
    status = fields.Selection([
        ("missing", "Manquant"),
        ("uploaded", "Uploadé"),
        ("under_review", "En revue"),
        ("approved", "Approuvé"),
        ("rejected", "Rejeté"),
        ("expired", "Expiré"),
    ], default="uploaded", tracking=True)
    expiry_date = fields.Date()
    reviewed_by = fields.Many2one("res.users")
    reviewed_at = fields.Datetime()
    rejection_reason = fields.Text()
    checksum = fields.Char(index=True)
    version = fields.Integer(default=1)

    def action_approve(self):
        self.write({"status": "approved", "reviewed_by": self.env.user.id, "reviewed_at": fields.Datetime.now()})
        return True

    def action_reject(self, reason=None):
        self.write({"status": "rejected", "reviewed_by": self.env.user.id, "reviewed_at": fields.Datetime.now(), "rejection_reason": reason})
        return True


class SolarTrainingCourse(models.Model):
    _name = "solar.training.course"
    _description = "SolarCell training course"
    _order = "sequence, name"

    name = fields.Char(required=True, translate=True)
    code = fields.Char(required=True, index=True)
    description = fields.Text(translate=True)
    required = fields.Boolean(default=True)
    sequence = fields.Integer(default=10)
    active = fields.Boolean(default=True)

    _sql_constraints = [("code_unique", "unique(code)", "Course code must be unique.")]


class SolarTrainingProgress(models.Model):
    _name = "solar.training.progress"
    _description = "Installer training progress"
    _order = "application_id, course_id"

    application_id = fields.Many2one("solar.installer.application", required=True, ondelete="cascade", index=True)
    partner_id = fields.Many2one(related="application_id.partner_id", store=True, readonly=True)
    course_id = fields.Many2one("solar.training.course", required=True, ondelete="restrict")
    required = fields.Boolean(related="course_id.required", store=True)
    progress_percent = fields.Float(default=0.0)
    status = fields.Selection([
        ("not_started", "Non démarré"),
        ("in_progress", "En cours"),
        ("completed", "Complété"),
        ("failed", "Échec"),
    ], default="not_started")
    started_at = fields.Datetime()
    completed_at = fields.Datetime()
    score = fields.Float()
    certificate_attachment_id = fields.Many2one("ir.attachment")

    _sql_constraints = [("uniq_course_application", "unique(application_id, course_id)", "Course already linked to this application.")]

    @api.constrains("progress_percent")
    def _check_progress_percent(self):
        for rec in self:
            if rec.progress_percent < 0 or rec.progress_percent > 100:
                raise ValidationError("Progress must be between 0 and 100.")


class SolarContractTemplate(models.Model):
    _name = "solar.contract.template"
    _description = "SolarCell installer contract template"
    _order = "version desc, id desc"

    name = fields.Char(required=True)
    version = fields.Char(required=True)
    body_html = fields.Html()
    active = fields.Boolean(default=True)
    attachment_id = fields.Many2one("ir.attachment", string="Template PDF")


class SolarInstallerContract(models.Model):
    _name = "solar.installer.contract"
    _description = "Installer contract instance"
    _inherit = ["mail.thread"]
    _order = "create_date desc"

    application_id = fields.Many2one("solar.installer.application", required=True, ondelete="cascade", index=True)
    partner_id = fields.Many2one(related="application_id.partner_id", store=True, readonly=True)
    company_partner_id = fields.Many2one(related="application_id.company_partner_id", store=True, readonly=True)
    template_id = fields.Many2one("solar.contract.template", required=False)
    version = fields.Char()
    status = fields.Selection([
        ("draft", "Brouillon"),
        ("generated", "Généré"),
        ("sent", "Envoyé"),
        ("accepted", "Accepté"),
        ("signed", "Signé"),
        ("cancelled", "Annulé"),
    ], default="draft", tracking=True)
    unsigned_attachment_id = fields.Many2one("ir.attachment")
    signed_attachment_id = fields.Many2one("ir.attachment")
    accepted_terms = fields.Boolean()
    accepted_at = fields.Datetime()
    accepted_ip = fields.Char()
    accepted_user_agent = fields.Char()
    signature_provider = fields.Selection([("none", "None"), ("oca", "OCA"), ("yousign", "Yousign"), ("docusign", "DocuSign")], default="none")
    provider_envelope_id = fields.Char()
    signed_at = fields.Datetime()


class SolarWallet(models.Model):
    _name = "solar.wallet"
    _description = "Installer SolarCell wallet"
    _inherit = ["mail.thread"]
    _order = "create_date desc"

    application_id = fields.Many2one("solar.installer.application", required=True, ondelete="cascade", index=True)
    partner_id = fields.Many2one(related="application_id.partner_id", store=True, readonly=True)
    wallet_type = fields.Selection([("integrated", "Wallet SolarCell intégré"), ("external", "Wallet externe")], default="integrated", required=True)
    custody_type = fields.Selection([("custodial", "Custodial"), ("non_custodial", "Non-custodial")], default="custodial")
    network = fields.Selection([("solarcell", "SolarCell"), ("polygon", "Polygon"), ("ethereum", "Ethereum")], default="solarcell")
    public_address = fields.Char(index=True)
    provider_ref = fields.Char(index=True)
    status = fields.Selection([("pending", "En attente"), ("active", "Actif"), ("suspended", "Suspendu"), ("closed", "Fermé")], default="pending", tracking=True)
    recovery_confirmed = fields.Boolean()
    recovery_confirmed_at = fields.Datetime()
    activated_at = fields.Datetime()
    ledger_ids = fields.One2many("solar.reward.ledger", "wallet_id")

    def action_activate(self):
        self.write({"status": "active", "activated_at": fields.Datetime.now()})
        return True


class SolarRewardLedger(models.Model):
    _name = "solar.reward.ledger"
    _description = "SolarCell reward ledger"
    _order = "create_date desc, id desc"

    wallet_id = fields.Many2one("solar.wallet", required=True, ondelete="restrict", index=True)
    partner_id = fields.Many2one(related="wallet_id.partner_id", store=True, readonly=True)
    entry_type = fields.Selection([("mission_reward", "Mission reward"), ("adjustment", "Adjustment"), ("withdrawal", "Withdrawal")], required=True)
    amount = fields.Float(required=True)
    token_symbol = fields.Char(default="SLC", required=True)
    mission_ref = fields.Char()
    status = fields.Selection([("pending", "Pending"), ("confirmed", "Confirmed"), ("cancelled", "Cancelled")], default="pending")
    tx_hash = fields.Char(index=True)
    confirmed_at = fields.Datetime()


class SolarOnboardingAuditEvent(models.Model):
    _name = "solar.onboarding.audit.event"
    _description = "SolarCell onboarding audit event"
    _order = "create_date desc"

    application_id = fields.Many2one("solar.installer.application", required=True, ondelete="cascade", index=True)
    event_type = fields.Char(required=True, index=True)
    step = fields.Selection(APPLICATION_STEPS)
    payload_json = fields.Text()
    actor_user_id = fields.Many2one("res.users")
    ip_address = fields.Char()
    user_agent = fields.Char()
