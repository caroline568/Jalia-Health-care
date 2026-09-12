from datetime import datetime, timedelta

from flask import Blueprint, request, jsonify, abort

from extensions import db
from models import CareRecipient, CareNetworkMember, CareEvent, Handoff, User
from auth import require_auth
import extraction

api_bp = Blueprint("api", __name__, url_prefix="/api")


# ---------------------------------------------------------------- helpers --

def _parse_dt(value, default=None):
    if not value:
        return default
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).replace(tzinfo=None)
    except (ValueError, AttributeError):
        return default


def _get_recipient_or_404(recipient_id):
    recipient = db.session.get(CareRecipient, recipient_id)
    if not recipient:
        abort(404, description="Care recipient not found.")
    return recipient


def _authorize(user, recipient):
    if recipient.created_by == user.id:
        return True
    member = CareNetworkMember.query.filter_by(
        care_recipient_id=recipient.id, user_id=user.id
    ).first()
    if not member:
        abort(403, description="You don't have access to this care space.")
    return True


def _member_names(recipient):
    names = [m.name for m in recipient.members]
    return names


# ------------------------------------------------------------- recipients --

@api_bp.get("/care-recipients")
@require_auth
def list_recipients(user):
    owned_ids = {r.id for r in CareRecipient.query.filter_by(created_by=user.id)}
    member_ids = {
        m.care_recipient_id
        for m in CareNetworkMember.query.filter_by(user_id=user.id)
    }
    ids = owned_ids | member_ids
    recipients = CareRecipient.query.filter(CareRecipient.id.in_(ids)).all() if ids else []

    result = []
    for r in recipients:
        result.append(_home_card(r))
    return jsonify({"careRecipients": result})


def _home_card(recipient):
    """Home should answer 'who needs my attention' with light, meaningful context."""
    upcoming_appt = (
        CareEvent.query.filter_by(care_recipient_id=recipient.id, type="appointment")
        .filter(CareEvent.occurred_at >= datetime.utcnow() - timedelta(hours=1))
        .order_by(CareEvent.occurred_at.asc())
        .first()
    )
    recent = (
        CareEvent.query.filter_by(care_recipient_id=recipient.id)
        .filter(CareEvent.type != "appointment")
        .order_by(CareEvent.occurred_at.desc())
        .first()
    )
    open_task = (
        CareEvent.query.filter_by(care_recipient_id=recipient.id, type="task", status="open")
        .order_by(CareEvent.due_at.asc().nullslast())
        .first()
    )

    return {
        **recipient.summary_dict(),
        "needsAttention": upcoming_appt.to_dict() if upcoming_appt else None,
        "recent": recent.to_dict() if recent else None,
        "next": open_task.to_dict() if open_task else None,
        "network": [m.to_dict() for m in recipient.members],
    }


@api_bp.post("/care-recipients")
@require_auth
def create_recipient(user):
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Enter a name."}), 400

    recipient = CareRecipient(
        name=name,
        relationship_label=(data.get("relationshipLabel") or "").strip() or None,
        photo_url=data.get("photoUrl"),
        date_of_birth=data.get("dateOfBirth"),
        notes=data.get("notes"),
        created_by=user.id,
    )
    db.session.add(recipient)
    db.session.flush()

    owner_member = CareNetworkMember(
        care_recipient_id=recipient.id,
        user_id=user.id,
        name=user.name,
        role="Owner",
        email=user.email,
        is_owner=True,
    )
    db.session.add(owner_member)
    db.session.commit()

    return jsonify({"careRecipient": _home_card(recipient)}), 201


@api_bp.get("/care-recipients/<recipient_id>")
@require_auth
def get_recipient(user, recipient_id):
    recipient = _get_recipient_or_404(recipient_id)
    _authorize(user, recipient)

    upcoming = (
        CareEvent.query.filter_by(care_recipient_id=recipient.id, type="appointment")
        .filter(CareEvent.occurred_at >= datetime.utcnow() - timedelta(hours=1))
        .order_by(CareEvent.occurred_at.asc())
        .first()
    )
    recent_events = (
        CareEvent.query.filter_by(care_recipient_id=recipient.id)
        .order_by(CareEvent.occurred_at.desc())
        .limit(5)
        .all()
    )
    open_tasks = (
        CareEvent.query.filter_by(care_recipient_id=recipient.id, type="task", status="open")
        .order_by(CareEvent.due_at.asc().nullslast())
        .limit(5)
        .all()
    )

    return jsonify({
        "careRecipient": recipient.summary_dict(),
        "whatsHappeningNow": upcoming.to_dict() if upcoming else None,
        "recentCare": [e.to_dict() for e in recent_events],
        "whatsNext": [e.to_dict() for e in open_tasks],
        "network": [m.to_dict() for m in recipient.members],
    })


@api_bp.patch("/care-recipients/<recipient_id>")
@require_auth
def update_recipient(user, recipient_id):
    recipient = _get_recipient_or_404(recipient_id)
    _authorize(user, recipient)
    data = request.get_json(silent=True) or {}

    for field, attr in [
        ("name", "name"),
        ("relationshipLabel", "relationship_label"),
        ("photoUrl", "photo_url"),
        ("dateOfBirth", "date_of_birth"),
        ("notes", "notes"),
    ]:
        if field in data:
            setattr(recipient, attr, data[field])

    db.session.commit()
    return jsonify({"careRecipient": recipient.summary_dict()})


# ----------------------------------------------------------------- network --

@api_bp.get("/care-recipients/<recipient_id>/network")
@require_auth
def list_network(user, recipient_id):
    recipient = _get_recipient_or_404(recipient_id)
    _authorize(user, recipient)
    return jsonify({"network": [m.to_dict() for m in recipient.members]})


@api_bp.post("/care-recipients/<recipient_id>/network")
@require_auth
def add_network_member(user, recipient_id):
    recipient = _get_recipient_or_404(recipient_id)
    _authorize(user, recipient)
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Enter a name."}), 400

    invited_user = None
    email = (data.get("email") or "").strip().lower() or None
    if email:
        invited_user = User.query.filter_by(email=email).first()

    member = CareNetworkMember(
        care_recipient_id=recipient.id,
        user_id=invited_user.id if invited_user else None,
        name=name,
        role=(data.get("role") or "").strip() or "Family member",
        email=email,
    )
    db.session.add(member)
    db.session.commit()
    return jsonify({"member": member.to_dict()}), 201


# ------------------------------------------------------------------- events --

@api_bp.get("/care-recipients/<recipient_id>/events")
@require_auth
def list_events(user, recipient_id):
    recipient = _get_recipient_or_404(recipient_id)
    _authorize(user, recipient)

    query = CareEvent.query.filter_by(care_recipient_id=recipient.id)
    event_type = request.args.get("type")
    if event_type:
        query = query.filter_by(type=event_type)

    since = request.args.get("since")
    since_dt = _parse_dt(since)
    if since_dt:
        query = query.filter(CareEvent.occurred_at >= since_dt)

    limit = min(int(request.args.get("limit", 100)), 300)
    events = query.order_by(CareEvent.occurred_at.desc()).limit(limit).all()
    return jsonify({"events": [e.to_dict() for e in events]})


@api_bp.post("/care-recipients/<recipient_id>/events")
@require_auth
def create_event(user, recipient_id):
    """Directly save a confirmed event — used for manual entry and for
    saving a reviewed capture suggestion once the caregiver hits Confirm."""
    recipient = _get_recipient_or_404(recipient_id)
    _authorize(user, recipient)
    data = request.get_json(silent=True) or {}

    event_type = data.get("type")
    if event_type not in (
        "appointment", "medication", "observation", "communication",
        "task", "result", "document", "handoff",
    ):
        return jsonify({"error": "Unknown event type."}), 400

    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Give this a short title."}), 400

    event = CareEvent(
        care_recipient_id=recipient.id,
        created_by=user.id,
        type=event_type,
        title=title,
        summary=data.get("summary"),
        details=data.get("details") or {},
        source=data.get("source", "manual"),
        provenance=data.get("provenance", "confirmed"),
        confirmed=data.get("provenance", "confirmed") == "confirmed",
        occurred_at=_parse_dt(data.get("occurredAt"), datetime.utcnow()),
        due_at=_parse_dt(data.get("dueAt")),
        status=data.get("status", "open" if event_type == "task" else "open"),
    )

    assignee_id = data.get("assigneeId")
    if assignee_id:
        event.assignee_id = assignee_id

    db.session.add(event)
    db.session.commit()
    return jsonify({"event": event.to_dict()}), 201


@api_bp.get("/events/<event_id>")
@require_auth
def get_event(user, event_id):
    event = db.session.get(CareEvent, event_id)
    if not event:
        abort(404)
    recipient = _get_recipient_or_404(event.care_recipient_id)
    _authorize(user, recipient)
    return jsonify({"event": event.to_dict(), "careRecipient": recipient.summary_dict()})


@api_bp.patch("/events/<event_id>")
@require_auth
def update_event(user, event_id):
    event = db.session.get(CareEvent, event_id)
    if not event:
        abort(404)
    recipient = _get_recipient_or_404(event.care_recipient_id)
    _authorize(user, recipient)

    data = request.get_json(silent=True) or {}
    for field, attr in [
        ("title", "title"), ("summary", "summary"), ("details", "details"),
        ("status", "status"),
    ]:
        if field in data:
            setattr(event, attr, data[field])
    if "occurredAt" in data:
        event.occurred_at = _parse_dt(data["occurredAt"], event.occurred_at)
    if "dueAt" in data:
        event.due_at = _parse_dt(data["dueAt"])
    if "assigneeId" in data:
        event.assignee_id = data["assigneeId"]
    if data.get("confirm"):
        event.confirmed = True
        event.provenance = "confirmed"

    db.session.commit()
    return jsonify({"event": event.to_dict()})


@api_bp.delete("/events/<event_id>")
@require_auth
def delete_event(user, event_id):
    event = db.session.get(CareEvent, event_id)
    if not event:
        abort(404)
    recipient = _get_recipient_or_404(event.care_recipient_id)
    _authorize(user, recipient)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"ok": True})


# ---------------------------------------------------------------- capture --

@api_bp.post("/care-recipients/<recipient_id>/capture")
@require_auth
def capture(user, recipient_id):
    """
    Capture-first entry point shared by Speak / Snap / Screenshot / Upload / Type.
    Takes raw captured input and returns *unsaved* structured suggestions for
    the caregiver to Confirm / Edit / Discard — nothing is written to the
    care story until confirmed via POST .../events.
    """
    recipient = _get_recipient_or_404(recipient_id)
    _authorize(user, recipient)
    data = request.get_json(silent=True) or {}

    method = data.get("method")  # voice | photo | screenshot | upload | type
    raw_text = data.get("text", "")
    filename = data.get("filename")
    mime_type = data.get("mimeType")

    if method in ("photo", "screenshot", "upload") and not raw_text:
        suggestions = extraction.extract_from_document(filename or "captured file", mime_type)
    else:
        suggestions = extraction.extract_from_text(raw_text, source=method or "manual")

    source_map = {"voice": "voice", "photo": "photo", "screenshot": "screenshot",
                  "upload": "upload", "type": "manual"}
    source = source_map.get(method, "manual")

    for s in suggestions:
        s["source"] = source

    return jsonify({"suggestions": suggestions, "rawText": raw_text})


# ---------------------------------------------------------------- handoff --

def _generate_handoff_content(recipient, days=7):
    since = datetime.utcnow() - timedelta(days=days)
    events = (
        CareEvent.query.filter_by(care_recipient_id=recipient.id)
        .filter(CareEvent.occurred_at >= since)
        .order_by(CareEvent.occurred_at.asc())
        .all()
    )

    recent = [e.to_dict() for e in events if e.type != "task"]
    changed = [e.to_dict() for e in events if e.type == "medication"]
    outstanding = [
        e.to_dict() for e in
        CareEvent.query.filter_by(care_recipient_id=recipient.id, type="task", status="open").all()
    ]
    upcoming = [
        e.to_dict() for e in
        CareEvent.query.filter_by(care_recipient_id=recipient.id, type="appointment")
        .filter(CareEvent.occurred_at >= datetime.utcnow() - timedelta(hours=1))
        .order_by(CareEvent.occurred_at.asc())
        .all()
    ]
    needs_attention = [e.to_dict() for e in events if e.provenance == "needs_confirmation"]

    return {
        "recent": recent,
        "changed": changed,
        "outstanding": outstanding,
        "upcoming": upcoming,
        "needsAttention": needs_attention,
        "generatedAt": datetime.utcnow().isoformat(),
        "windowDays": days,
        "aiGenerated": True,
    }


@api_bp.get("/care-recipients/<recipient_id>/handoff/preview")
@require_auth
def preview_handoff(user, recipient_id):
    recipient = _get_recipient_or_404(recipient_id)
    _authorize(user, recipient)
    days = int(request.args.get("days", 7))
    return jsonify({"preview": _generate_handoff_content(recipient, days)})


@api_bp.get("/care-recipients/<recipient_id>/handoffs")
@require_auth
def list_handoffs(user, recipient_id):
    recipient = _get_recipient_or_404(recipient_id)
    _authorize(user, recipient)
    handoffs = (
        Handoff.query.filter_by(care_recipient_id=recipient.id)
        .order_by(Handoff.created_at.desc())
        .all()
    )
    return jsonify({"handoffs": [h.to_dict() for h in handoffs]})


@api_bp.post("/care-recipients/<recipient_id>/handoffs")
@require_auth
def save_handoff(user, recipient_id):
    recipient = _get_recipient_or_404(recipient_id)
    _authorize(user, recipient)
    data = request.get_json(silent=True) or {}

    content = data.get("content") or _generate_handoff_content(recipient)
    handoff = Handoff(
        care_recipient_id=recipient.id,
        created_by=user.id,
        recipient_name=data.get("recipientName"),
        content=content,
        edited=bool(data.get("edited")),
        shared=bool(data.get("shared")),
    )
    db.session.add(handoff)
    db.session.commit()
    return jsonify({"handoff": handoff.to_dict()}), 201
