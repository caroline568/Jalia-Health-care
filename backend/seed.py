"""
Optional: seed the database with a demo caregiver and a fuller household —
someone who's already been using Jalia for a few weeks, coordinating care
across very different situations at once:

  - Dad — advanced illness, hospice care, a bigger family network
            (a sibling who drives, a sibling who leads decisions, an aunt
            who administers medication)
  - Mum — a lighter, ongoing case (routine cardiology follow-up)
  - David — Caroline's husband, a short-term illness (flu)
  - Amani — Caroline's daughter, routine child health (a vaccine dose due,
            plus a mild cold)

Recipients and their events are created idempotently by name, so this is
safe to re-run any time without duplicating data.

Run with:  python seed.py
"""
from datetime import datetime, timedelta

from app import create_app
from extensions import db
from models import User, CareRecipient, CareNetworkMember, CareEvent, Handoff
from werkzeug.security import generate_password_hash

app = create_app()


def get_or_create_user(name, email, avatar_color):
    user = User.query.filter_by(email=email).first()
    if user:
        return user, False
    user = User(
        name=name, email=email,
        password_hash=generate_password_hash("password123"),
        avatar_color=avatar_color,
    )
    db.session.add(user)
    db.session.flush()
    return user, True


def get_or_create_recipient(name, created_by, **kwargs):
    recipient = CareRecipient.query.filter_by(name=name, created_by=created_by).first()
    if recipient:
        return recipient, False
    recipient = CareRecipient(name=name, created_by=created_by, **kwargs)
    db.session.add(recipient)
    db.session.flush()
    return recipient, True


with app.app_context():
    caroline, _ = get_or_create_user("Caroline", "caroline.demo@gmail.com", "#2F6F63")
    brian, _ = get_or_create_user("Brian", "brian.demo@gmail.com", "#B4694A")
    db.session.flush()
    now = datetime.utcnow()

    # ---------------------------------------------------------- Mum (existing) --
    mum, mum_created = get_or_create_recipient(
        "Mum", caroline.id,
        relationship_label="Mum", date_of_birth="1958-03-14",
        notes="Prefers appointments in the morning. Mild hearing loss in left ear.",
    )
    if mum_created:
        db.session.add_all([
            CareNetworkMember(care_recipient_id=mum.id, user_id=caroline.id,
                               name="Caroline", role="Primary caregiver",
                               email=caroline.email, is_owner=True),
            CareNetworkMember(care_recipient_id=mum.id, user_id=brian.id,
                               name="Brian", role="Weekend support", email=brian.email),
        ])
        db.session.add_all([
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
        ])

    # ------------------------------------------------------------------ Dad --
    dad, dad_created = get_or_create_recipient(
        "Dad", caroline.id,
        relationship_label="Dad", date_of_birth="1954-11-02",
        notes=("Advanced pancreatic cancer, under hospice care at home. "
               "Pain managed with morphine, administered by Aunt Njeri "
               "morning and evening. Prefers Kikuyu when he's tired."),
    )
    if dad_created:
        # Wanjiku (big sister) and Aunt Njeri are part of the care network
        # but don't have Jalia accounts themselves — Caroline logs on
        # their behalf, which is a common pattern for older relatives
        # who coordinate by phone rather than the app.
        db.session.add_all([
            CareNetworkMember(care_recipient_id=dad.id, user_id=caroline.id,
                               name="Caroline", role="Primary caregiver",
                               email=caroline.email, is_owner=True),
            CareNetworkMember(care_recipient_id=dad.id, user_id=brian.id,
                               name="Brian", role="Drives Dad to appointments",
                               email=brian.email),
            CareNetworkMember(care_recipient_id=dad.id, user_id=None,
                               name="Wanjiku", role="Leads decisions with the hospice team",
                               email="wanjiku.family@example.com"),
            CareNetworkMember(care_recipient_id=dad.id, user_id=None,
                               name="Aunt Njeri", role="Administers medication (morning & evening)",
                               email=""),
        ])

        older_1 = CareEvent(
            care_recipient_id=dad.id, created_by=caroline.id, type="appointment",
            title="Hospice intake assessment",
            summary="First home visit from the hospice team to set up the care plan.",
            details={"location": "Home visit", "escort": "Caroline"},
            source="manual", provenance="confirmed", confirmed=True,
            occurred_at=now - timedelta(days=18),
        )
        older_2 = CareEvent(
            care_recipient_id=dad.id, created_by=caroline.id, type="medication",
            title="Started on morphine",
            summary="Hospice doctor started a low-dose morphine schedule for pain control.",
            details={}, source="manual", provenance="confirmed", confirmed=True,
            occurred_at=now - timedelta(days=16),
        )
        older_3 = CareEvent(
            care_recipient_id=dad.id, created_by=caroline.id, type="document",
            title="Hospice care plan uploaded",
            summary="PDF from the hospice team outlining the pain management and visit schedule.",
            details={}, source="upload", provenance="confirmed", confirmed=True,
            occurred_at=now - timedelta(days=10),
        )
        db.session.add_all([
            older_1, older_2, older_3,
            CareEvent(care_recipient_id=dad.id, created_by=caroline.id, type="communication",
                      title="Hospice nurse called about pain plan",
                      summary="Discussed increasing the evening dose; nurse will reassess Friday.",
                      details={}, source="voice", provenance="confirmed", confirmed=True,
                      occurred_at=now - timedelta(days=3)),
            CareEvent(care_recipient_id=dad.id, created_by=caroline.id, type="observation",
                      title="Appetite has dropped sharply",
                      summary="Wanjiku noticed Dad barely ate anything today.",
                      details={}, source="voice", provenance="needs_confirmation", confirmed=False,
                      occurred_at=now - timedelta(days=2)),
            CareEvent(care_recipient_id=dad.id, created_by=caroline.id, type="medication",
                      title="Morphine dose adjusted",
                      summary="Aunt Njeri reported worse overnight pain; hospice nurse approved raising the evening dose.",
                      details={}, source="voice", provenance="confirmed", confirmed=True,
                      occurred_at=now - timedelta(days=1)),
            CareEvent(care_recipient_id=dad.id, created_by=caroline.id, type="result",
                      title="Latest bloodwork uploaded",
                      summary="Routine panel from this week's home visit.",
                      details={}, source="upload", provenance="confirmed", confirmed=True,
                      occurred_at=now - timedelta(hours=5)),
            CareEvent(care_recipient_id=dad.id, created_by=caroline.id, type="task",
                      title="Reorder incontinence supplies",
                      summary="Running low — order more before the weekend.",
                      details={"kind": "errand"}, source="manual", provenance="confirmed", confirmed=True,
                      status="open", due_at=now + timedelta(days=3),
                      occurred_at=now - timedelta(hours=4)),
            CareEvent(care_recipient_id=dad.id, created_by=caroline.id, type="appointment",
                      title="Hospice review with Dr. Otieno",
                      summary="Scheduled check-in on pain management and overall comfort.",
                      details={"location": "Nairobi Hospice Care Center", "escort": "Brian"},
                      source="manual", provenance="confirmed", confirmed=True,
                      occurred_at=now + timedelta(days=2, hours=3)),
        ])
        db.session.flush()

        # A past "Catch Me Up" — shows this isn't Caroline's first time
        # using Jalia for Dad's care.
        db.session.add(Handoff(
            care_recipient_id=dad.id, created_by=caroline.id,
            recipient_name="Wanjiku",
            content={
                "recent": [older_2.to_dict(), older_3.to_dict()],
                "changed": [older_2.to_dict()],
                "outstanding": [],
                "upcoming": [older_1.to_dict()],
                "needsAttention": [],
                "windowDays": 14,
                "aiGenerated": True,
            },
            edited=False, shared=True,
            created_at=now - timedelta(days=9),
        ))

    # --------------------------------------------------------------- David --
    david, david_created = get_or_create_recipient(
        "David", caroline.id,
        relationship_label="Husband",
        notes="Caroline's husband. Generally healthy — this is a short-term flu.",
    )
    if david_created:
        db.session.add(
            CareNetworkMember(care_recipient_id=david.id, user_id=caroline.id,
                               name="Caroline", role="Primary caregiver",
                               email=caroline.email, is_owner=True),
        )
        db.session.add_all([
            CareEvent(care_recipient_id=david.id, created_by=caroline.id, type="appointment",
                      title="GP visit for flu symptoms",
                      summary="Fever and body aches for two days — doctor confirmed flu, no complications.",
                      details={"location": "Nairobi Hospital Outpatient", "escort": "Caroline"},
                      source="manual", provenance="confirmed", confirmed=True,
                      occurred_at=now - timedelta(days=1)),
            CareEvent(care_recipient_id=david.id, created_by=caroline.id, type="medication",
                      title="Started on Tamiflu",
                      summary="Five-day course, twice daily with food.",
                      details={}, source="voice", provenance="confirmed", confirmed=True,
                      occurred_at=now - timedelta(days=1, hours=2)),
            CareEvent(care_recipient_id=david.id, created_by=caroline.id, type="observation",
                      title="Fever coming down",
                      summary="38.1°C this morning, down from 39.2°C yesterday. Resting at home.",
                      details={}, source="voice", provenance="confirmed", confirmed=True,
                      occurred_at=now - timedelta(hours=6)),
            CareEvent(care_recipient_id=david.id, created_by=caroline.id, type="task",
                      title="Check in if fever returns after day 3",
                      summary="Go back to the clinic if fever comes back once the Tamiflu course ends.",
                      details={"kind": "instruction"}, source="voice", provenance="confirmed", confirmed=True,
                      status="open", due_at=now + timedelta(days=2),
                      occurred_at=now - timedelta(hours=5)),
        ])

    # --------------------------------------------------------------- Amani --
    amani, amani_created = get_or_create_recipient(
        "Amani", caroline.id,
        relationship_label="Daughter", date_of_birth="2022-05-10",
        notes="Caroline's daughter. Up to date on most of her immunization schedule.",
    )
    if amani_created:
        db.session.add_all([
            CareNetworkMember(care_recipient_id=amani.id, user_id=caroline.id,
                               name="Caroline", role="Primary caregiver",
                               email=caroline.email, is_owner=True),
            CareNetworkMember(care_recipient_id=amani.id, user_id=None,
                               name="David", role="Dad", email=""),
        ])
        db.session.add_all([
            CareEvent(care_recipient_id=amani.id, created_by=caroline.id, type="observation",
                      title="Mild fever and runny nose",
                      summary="Caught a cold from daycare — 38.1°C, resting well, drinking fluids.",
                      details={}, source="voice", provenance="confirmed", confirmed=True,
                      occurred_at=now - timedelta(days=1)),
            CareEvent(care_recipient_id=amani.id, created_by=caroline.id, type="medication",
                      title="Given paediatric paracetamol",
                      summary="For the fever, as advised by the pharmacist.",
                      details={}, source="voice", provenance="confirmed", confirmed=True,
                      occurred_at=now - timedelta(days=1, hours=1)),
            CareEvent(care_recipient_id=amani.id, created_by=caroline.id, type="task",
                      title="Bring immunization card to clinic visit",
                      summary="Needed to log the polio booster dose.",
                      details={"kind": "reminder"}, source="manual", provenance="confirmed", confirmed=True,
                      status="open", due_at=now + timedelta(days=4),
                      occurred_at=now - timedelta(hours=2)),
            CareEvent(care_recipient_id=amani.id, created_by=caroline.id, type="appointment",
                      title="Polio booster (dose 3) at Well-Baby Clinic",
                      summary="Routine immunization — third polio dose, part of the standard schedule.",
                      details={"location": "City Health Clinic", "escort": "Caroline"},
                      source="manual", provenance="confirmed", confirmed=True,
                      occurred_at=now + timedelta(days=4, hours=1)),
        ])

    db.session.commit()

    print("Seeded demo account: caroline.demo@gmail.com / password123")
    print("Second family member: brian.demo@gmail.com / password123")
    print("Care spaces: Mum, Dad, David, Amani")