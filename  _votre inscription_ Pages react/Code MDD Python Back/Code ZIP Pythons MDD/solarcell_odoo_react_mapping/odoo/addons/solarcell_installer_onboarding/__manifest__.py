# -*- coding: utf-8 -*-
{
    "name": "SolarCell Installer Onboarding",
    "summary": "Mapping API React -> Odoo Community 18 for the 7-step SolarCell installer onboarding",
    "version": "18.0.1.0.0",
    "category": "Services/SolarCell",
    "author": "SolarCell",
    "license": "LGPL-3",
    "depends": ["base", "mail", "portal"],
    "data": [
        "security/ir.model.access.csv",
        "data/solar_reference_data.xml",
    ],
    "installable": True,
    "application": False,
}
