# -*- coding: utf-8 -*-
from odoo import api, fields, models
from odoo.exceptions import ValidationError


class ResPartner(models.Model):
    _inherit = "res.partner"

    solar_is_installer_candidate = fields.Boolean(
        string="SolarCell installer candidate",
        index=True,
        default=False,
    )
    solar_birthdate = fields.Date(string="Date of birth")
    solar_birth_country_id = fields.Many2one("res.country", string="Birth country")
    solar_nationality_id = fields.Many2one("res.country", string="Nationality")

    solar_structure_type = fields.Selection(
        selection=[
            ("sole_trader", "Entreprise individuelle"),
            ("company", "Société"),
            ("freelance", "Freelance"),
            ("association", "Association"),
            ("other", "Autre"),
        ],
        string="SolarCell structure type",
    )
    solar_siret = fields.Char(string="SIRET", index=True)
    solar_ape_naf = fields.Char(string="APE / NAF code")
    solar_creation_year = fields.Integer(string="Company creation year")
    solar_employee_range = fields.Selection(
        selection=[
            ("0", "0 salarié"),
            ("1_5", "1 à 5 salariés"),
            ("6_20", "6 à 20 salariés"),
            ("21_50", "21 à 50 salariés"),
            ("50_plus", "Plus de 50 salariés"),
        ],
        string="Employee range",
    )
    solar_main_activity = fields.Text(string="Main professional activity")

    solar_application_ids = fields.One2many(
        "solar.installer.application",
        "partner_id",
        string="SolarCell onboarding applications",
    )

    @api.constrains("solar_siret")
    def _check_siret(self):
        for partner in self:
            if partner.solar_siret:
                digits = ''.join(ch for ch in partner.solar_siret if ch.isdigit())
                if len(digits) != 14:
                    raise ValidationError("Le numéro SIRET doit contenir 14 chiffres.")
