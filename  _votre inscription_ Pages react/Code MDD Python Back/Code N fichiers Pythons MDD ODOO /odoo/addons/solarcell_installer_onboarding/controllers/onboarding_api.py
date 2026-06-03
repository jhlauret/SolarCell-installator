# -*- coding: utf-8 -*-
import base64
import hashlib
import json

from odoo import http
from odoo.http import request
from odoo.exceptions import AccessDenied

from ..services.front_mapper import SolarOnboardingFrontMapper


class SolarCellOnboardingApi(http.Controller):
    """Custom API used by React or a Node.js BFF.

    Security model for this starter:
    - If ir.config_parameter solarcell.api_key is set, calls must include it as:
      X-SolarCell-Api-Key: <value>
    - Otherwise, the route is usable by authenticated Odoo users only.

    For production, prefer OAuth/API gateway/IP filtering/rate limiting on top of this.
    """

    def _require_access(self):
        configured_key = request.env["ir.config_parameter"].sudo().get_param("solarcell.api_key")
        if configured_key:
            provided = request.httprequest.headers.get("X-SolarCell-Api-Key")
            if provided != configured_key:
                raise AccessDenied("Invalid SolarCell API key")
        elif request.env.user._is_public():
            raise AccessDenied("Authentication required. Configure solarcell.api_key for public API calls.")

    def _mapper(self):
        http_request = request.httprequest
        return SolarOnboardingFrontMapper(
            request.env,
            user=request.env.user,
            ip_address=http_request.headers.get("X-Forwarded-For", http_request.remote_addr),
            user_agent=http_request.headers.get("User-Agent"),
        )

    def _serialize_application(self, app):
        return {
            "id": app.id,
            "reference": app.name,
            "currentStep": app.current_step,
            "progressPercent": app.progress_percent,
            "partnerId": app.partner_id.id,
            "companyPartnerId": app.company_partner_id.id or None,
            "statuses": {
                "kyc": app.kyc_status,
                "kyb": app.kyb_status,
                "training": app.training_status,
                "contract": app.contract_status,
                "wallet": app.wallet_status,
            },
        }

    @http.route("/solar/onboarding/start", type="json", auth="public", methods=["POST"], csrf=False)
    def start_onboarding(self, **params):
        self._require_access()
        payload = params.get("payload") or params
        app = self._mapper().start_or_update(payload)
        return {"ok": True, "application": self._serialize_application(app)}

    @http.route("/solar/onboarding/<int:application_id>/step/<string:step>", type="json", auth="public", methods=["POST"], csrf=False)
    def save_step(self, application_id, step, **params):
        self._require_access()
        app = request.env["solar.installer.application"].sudo().browse(application_id).exists()
        if not app:
            return {"ok": False, "error": "Application not found"}
        payload = params.get("payload") if "payload" in params else params
        self._mapper().save_step(app, step, payload)
        return {"ok": True, "application": self._serialize_application(app)}

    @http.route("/solar/onboarding/<int:application_id>/status", type="json", auth="public", methods=["POST"], csrf=False)
    def get_status(self, application_id, **params):
        self._require_access()
        app = request.env["solar.installer.application"].sudo().browse(application_id).exists()
        if not app:
            return {"ok": False, "error": "Application not found"}
        return {"ok": True, "application": self._serialize_application(app)}

    @http.route("/solar/onboarding/<int:application_id>/documents", type="http", auth="public", methods=["POST"], csrf=False)
    def upload_document(self, application_id, **post):
        self._require_access()
        app = request.env["solar.installer.application"].sudo().browse(application_id).exists()
        if not app:
            return request.make_json_response({"ok": False, "error": "Application not found"}, status=404)

        requirement_code = post.get("requirement_code") or post.get("requirementCode")
        file_storage = request.httprequest.files.get("file")
        if not requirement_code or not file_storage:
            return request.make_json_response({"ok": False, "error": "requirement_code and file are required"}, status=400)

        content = file_storage.read()
        checksum = hashlib.sha256(content).hexdigest()
        attachment = request.env["ir.attachment"].sudo().create({
            "name": file_storage.filename,
            "datas": base64.b64encode(content),
            "res_model": "solar.installer.application",
            "res_id": app.id,
            "mimetype": file_storage.mimetype,
        })
        doc = self._mapper().upload_document(app, requirement_code, attachment, checksum=checksum, expiry_date=post.get("expiry_date"))
        return request.make_json_response({
            "ok": True,
            "document": {
                "id": doc.id,
                "requirementCode": doc.requirement_id.code,
                "status": doc.status,
                "attachmentId": doc.attachment_id.id,
                "checksum": doc.checksum,
            },
            "application": self._serialize_application(app),
        })
