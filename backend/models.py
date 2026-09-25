import uuid
from datetime import datetime

from extensions import db


def gen_id():
    return uuid.uuid4().hex


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(32), primary_key=True, default=gen_id)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    avatar_color = db.Column(db.String(16), default="#2F6F63")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "avatarColor": self.avatar_color,
        }


class CareRecipient(db.Model):
    """A loved one whose care is being coordinated — the center of a Care Space."""

    __tablename__ = "care_recipients"

    id = db.Column(db.String(32), primary_key=True, default=gen_id)
    name = db.Column(db.String(120), nullable=False)
    relationship_label = db.Column(db.String(80))  # e.g. "Mum", "Dad", "Grandma Wanjiru"
    photo_url = db.Column(db.String(512))
    date_of_birth = db.Column(db.String(20))
    notes = db.Column(db.Text)
    created_by = db.Column(db.String(32), db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    members = db.relationship(
        "CareNetworkMember", backref="care_recipient", cascade="all, delete-orphan"
    )
    events = db.relationship(
        "CareEvent",
        backref="care_recipient",
        cascade="all, delete-orphan",
        order_by="CareEvent.occurred_at.desc()",
    )

    def summary_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "relationshipLabel": self.relationship_label,
            "photoUrl": self.photo_url,
            "dateOfBirth": self.date_of_birth,
            "notes": self.notes,
        }


class CareNetworkMember(db.Model):
    """A person in the loved one's care network (family, trusted helpers)."""

    __tablename__ = "care_network_members"

    id = db.Column(db.String(32), primary_key=True, default=gen_id)
    care_recipient_id = db.Column(db.String(32), db.ForeignKey("care_recipients.id"), nullable=False)
    user_id = db.Column(db.String(32), db.ForeignKey("users.id"), nullable=True)
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(80))  # e.g. "Primary caregiver", "Weekend support"
    email = db.Column(db.String(255))
    is_owner = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "name": self.name,
            "role": self.role,
            "email": self.email,
            "isOwner": self.is_owner,
        }


EVENT_TYPES = (
    "appointment",
    "medication",
    "observation",
    "communication",
    "task",
    "result",
    "document",
    "handoff",
)

SOURCE_TYPES = ("voice", "photo", "screenshot", "upload", "manual", "system")

PROVENANCE_STATES = ("confirmed", "needs_confirmation", "ai_generated")


class CareEvent(db.Model):
    """
    The unified building block of the care story that Coordinate is built from.
    Appointments, medication changes, observations, communications, tasks,
    results and documents are all CareEvents with a `type`, so the family
    experiences one connected timeline rather than separate feature silos.
    """

    __tablename__ = "care_events"

    id = db.Column(db.String(32), primary_key=True, default=gen_id)
    care_recipient_id = db.Column(db.String(32), db.ForeignKey("care_recipients.id"), nullable=False)
    created_by = db.Column(db.String(32), db.ForeignKey("users.id"), nullable=False)

    type = db.Column(db.String(32), nullable=False)  # EVENT_TYPES
    title = db.Column(db.String(200), nullable=False)
    summary = db.Column(db.Text)
    details = db.Column(db.JSON, default=dict)  # type-specific structured payload

    source = db.Column(db.String(20), default="manual")  # SOURCE_TYPES
    provenance = db.Column(db.String(24), default="confirmed")  # PROVENANCE_STATES
    confirmed = db.Column(db.Boolean, default=True)

    occurred_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # For task-type events / follow-ups
    assignee_id = db.Column(db.String(32), db.ForeignKey("users.id"), nullable=True)
    due_at = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default="open")  # open | done | cancelled

    creator = db.relationship("User", foreign_keys=[created_by])
    assignee = db.relationship("User", foreign_keys=[assignee_id])

    def to_dict(self):
        return {
            "id": self.id,
            "careRecipientId": self.care_recipient_id,
            "type": self.type,
            "title": self.title,
            "summary": self.summary,
            "details": self.details or {},
            "source": self.source,
            "provenance": self.provenance,
            "confirmed": self.confirmed,
            "occurredAt": self.occurred_at.isoformat() if self.occurred_at else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "createdBy": {"id": self.creator.id, "name": self.creator.name} if self.creator else None,
            "assignee": {"id": self.assignee.id, "name": self.assignee.name} if self.assignee else None,
            "dueAt": self.due_at.isoformat() if self.due_at else None,
            "status": self.status,
        }


class Handoff(db.Model):
    """A generated 'Catch Me Up' handoff, reviewed and shared between caregivers."""

    __tablename__ = "handoffs"

    id = db.Column(db.String(32), primary_key=True, default=gen_id)
    care_recipient_id = db.Column(db.String(32), db.ForeignKey("care_recipients.id"), nullable=False)
    created_by = db.Column(db.String(32), db.ForeignKey("users.id"), nullable=False)
    recipient_name = db.Column(db.String(120))  # who it's being handed off to (may not be a User)
    content = db.Column(db.JSON, default=dict)  # structured sections: recent, changed, outstanding, upcoming
    edited = db.Column(db.Boolean, default=False)
    shared = db.Column(db.Boolean, default=False)
    share_token = db.Column(db.String(64))  # set when shared — grants read-only access with no login
    share_expires_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "careRecipientId": self.care_recipient_id,
            "recipientName": self.recipient_name,
            "content": self.content or {},
            "edited": self.edited,
            "shared": self.shared,
            "shareToken": self.share_token,
            "shareExpiresAt": self.share_expires_at.isoformat() if self.share_expires_at else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }