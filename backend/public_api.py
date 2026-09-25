"""
Unauthenticated, read-only access to a single shared handoff — this is the
one deliberate crack in Jalia's normal "you must be a network member" rule,
scoped as narrowly as possible: a random, unguessable token grants access to
exactly one handoff's content, nothing else, and only until it expires.

No Jalia account, login, or care-network membership is required to view it —
that's the point. It exists for the case a full account doesn't fit: a
one-off provider at a walk-in clinic, a relative who isn't in the app,
anyone who just needs the "catch me up" context without becoming a
permanent member of the family's care space.
"""
from datetime import datetime

from flask import Blueprint, jsonify, abort

from models import Handoff, CareRecipient

public_bp = Blueprint("public", __name__, url_prefix="/api/public")


@public_bp.get("/handoffs/<token>")
def get_shared_handoff(token):
    handoff = Handoff.query.filter_by(share_token=token).first()
    if not handoff:
        abort(404, description="This link is invalid or has been revoked.")

    if handoff.share_expires_at and handoff.share_expires_at < datetime.utcnow():
        abort(410, description="This link has expired. Ask for a new one.")

    recipient = CareRecipient.query.get(handoff.care_recipient_id)

    return jsonify({
        "handoff": {
            "recipientDisplayName": recipient.name if recipient else None,
            "recipientName": handoff.recipient_name,
            "content": handoff.content or {},
            "createdAt": handoff.created_at.isoformat() if handoff.created_at else None,
            "expiresAt": handoff.share_expires_at.isoformat() if handoff.share_expires_at else None,
        },
    })
