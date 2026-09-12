"""
Optional: seed the database with a demo caregiver, a care recipient, and a
small care story so you can explore Jalia immediately.

Run with:  python seed.py
"""
from datetime import datetime, timedelta

from app import create_app
from extensions import db
from models import User, CareRecipient, CareNetworkMember, CareEvent
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    if User.query.filter_by(email="caroline.demo@gmail.com").first():
        print("Demo data already exists. Skipping.")
    else:
        caroline = User(
            name="Caroline",
            email="caroline.demo@gmail.com",
            password_hash=generate_password_hash("password123"),
            avatar_color="#2F6F63",
        )
        brian = User(
            name="Brian",
            email="brian.demo@gmail.com",
            password_hash=generate_password_hash("password123"),
            avatar_color="#B4694A",
        )
        db.session.add_all([caroline, brian])
        db.session.flush()

        mum = CareRecipient(
            name="Mum",
            relationship_label="Mum",
            date_of_birth="1958-03-14",
            notes="Prefers appointments in the morning. Mild hearing loss in left ear.",
            created_by=caroline.id,
        )
        db.session.add(mum)
        db.session.flush()

        db.session.add_all([
            CareNetworkMember(care_recipient_id=mum.id, user_id=caroline.id,
                               name="Caroline", role="Primary caregiver",
                               email=caroline.email, is_owner=True),
            CareNetworkMember(care_recipient_id=mum.id, user_id=brian.id,
                               name="Brian", role="Weekend support", email=brian.email),
        ])

        now = datetime.utcnow()
        events = [
            CareEvent(care_recipient_id=mum.id, created_by=caroline.id, type="appointment",
                      title="Cardiology follow-up", summary="Routine check on blood pressure medication.",
                      details={"location": "Nairobi Hospital", "escort": "Caroline"},
                      source="manual", provenance="confirmed", confirmed=True,
                      occurred_at=now + timedelta(days=1, hours=2)),
            CareEvent(care_recipient_id=mum.id, created_by=caroline.id, type="medication",
                      title="Medication changed", summary="Doctor increased lisinopril to 10mg, once daily.",
                      details={}, source="voice", provenance="confirmed", confirmed=True,
                      occurred_at=now - timedelta(days=2)),
            CareEvent(care_recipient_id=mum.id, created_by=brian.id, type="observation",
                      title="Dizziness reported", summary="Mum felt dizzy this morning after breakfast.",
                      details={}, source="voice", provenance="needs_confirmation", confirmed=False,
                      occurred_at=now - timedelta(days=1, hours=5)),
            CareEvent(care_recipient_id=mum.id, created_by=brian.id, type="task",
                      title="Call clinic if dizziness continues", summary="Follow up if symptoms persist past today.",
                      details={"kind": "instruction"}, source="voice", provenance="confirmed", confirmed=True,
                      status="open", due_at=now + timedelta(hours=6),
                      occurred_at=now - timedelta(days=1, hours=4)),
            CareEvent(care_recipient_id=mum.id, created_by=caroline.id, type="result",
                      title="Lab result uploaded", summary="Full blood count — within normal range.",
                      details={}, source="upload", provenance="confirmed", confirmed=True,
                      occurred_at=now - timedelta(hours=20)),
        ]
        db.session.add_all(events)
        db.session.commit()

        print("Seeded demo account: caroline.demo@gmail.com / password123")
        print("Second family member: brian.demo@gmail.com / password123")
