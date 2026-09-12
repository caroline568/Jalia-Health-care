"""
Intelligent capture for Jalia.

This module turns raw captured input (a voice transcript, OCR'd text from a
photo/screenshot/document, or typed notes) into a set of structured
*suggestions* that the caregiver reviews and confirms — Jalia never silently
turns an inference into a confirmed medical fact (Rule 6).

In production this function would call an LLM (e.g. the Anthropic Messages
API) with the transcript/OCR text and a prompt asking it to identify
appointments, medication changes, observations, instructions and follow-ups,
returning strictly-typed JSON. It is implemented here with transparent
keyword heuristics so the product works fully offline and with zero
configuration — the extraction boundary is isolated in this one module so a
real model call is a drop-in replacement (see `_call_model` below).
"""
import re
from datetime import datetime, timedelta

MED_KEYWORDS = ["medication", "dose", "dosage", "prescri", "tablet", "mg", "pill", "drug"]
APPT_KEYWORDS = ["appointment", "clinic", "hospital", "visit", "come back", "follow up",
                 "follow-up", "see the doctor", "next tuesday", "next week", "tomorrow"]
OBSERVATION_KEYWORDS = ["dizzy", "dizziness", "pain", "fever", "tired", "vomit", "cough",
                        "swelling", "rash", "bleeding", "not feeling well", "nausea", "weak"]
INSTRUCTION_KEYWORDS = ["monitor", "should", "must", "need to", "make sure", "avoid",
                        "continue", "stop taking", "take with food", "rest"]
COMMUNICATION_KEYWORDS = ["called", "call", "phoned", "spoke to", "spoke with", "contacted",
                          "texted", "messaged", "told us", "informed"]

WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


def _contains_any(text, keywords):
    return [k for k in keywords if k in text]


def _guess_future_date(text):
    """Very light heuristic date guesser for demo purposes only."""
    text = text.lower()
    now = datetime.utcnow()
    if "tomorrow" in text:
        return (now + timedelta(days=1)).isoformat()
    for i, day in enumerate(WEEKDAYS):
        if day in text:
            days_ahead = (i - now.weekday()) % 7
            days_ahead = days_ahead or 7
            return (now + timedelta(days=days_ahead)).isoformat()
    return None


def extract_from_text(raw_text, source="manual"):
    """
    Returns a list of suggestion dicts:
      { type, title, summary, details, confidence: 'stated' | 'inferred', provenance }
    `stated` means it closely mirrors what the caregiver explicitly said.
    `inferred` means Jalia is guessing at structure (e.g. a possible follow-up)
    and should be reviewed more carefully before being confirmed.
    """
    if not raw_text or not raw_text.strip():
        return []

    text = raw_text.strip()
    lower = text.lower()
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+|\n+", text) if s.strip()]

    suggestions = []

    for sentence in sentences:
        s_lower = sentence.lower()

        if _contains_any(s_lower, OBSERVATION_KEYWORDS):
            suggestions.append({
                "type": "observation",
                "title": "Observation reported",
                "summary": sentence,
                "details": {},
                "confidence": "stated",
            })

        if _contains_any(s_lower, COMMUNICATION_KEYWORDS):
            suggestions.append({
                "type": "communication",
                "title": "Communication logged",
                "summary": sentence,
                "details": {},
                "confidence": "stated",
            })

        if _contains_any(s_lower, MED_KEYWORDS):
            suggestions.append({
                "type": "medication",
                "title": "Possible medication change",
                "summary": sentence,
                "details": {},
                "confidence": "stated" if "chang" in s_lower or "prescri" in s_lower else "inferred",
            })

        if _contains_any(s_lower, INSTRUCTION_KEYWORDS):
            suggestions.append({
                "type": "task",
                "title": "Instruction to follow",
                "summary": sentence,
                "details": {"kind": "instruction"},
                "confidence": "stated",
            })

        if _contains_any(s_lower, APPT_KEYWORDS):
            when = _guess_future_date(s_lower)
            suggestions.append({
                "type": "appointment",
                "title": "Possible appointment or follow-up",
                "summary": sentence,
                "details": {"suggestedDate": when} if when else {},
                "confidence": "stated" if "appointment" in s_lower or "clinic" in s_lower else "inferred",
            })

    if not suggestions:
        # Fall back to a single generic observation so nothing captured is lost,
        # clearly marked as needing the caregiver's framing.
        suggestions.append({
            "type": "observation",
            "title": "Note captured",
            "summary": text,
            "details": {},
            "confidence": "inferred",
        })

    for s in suggestions:
        s["provenance"] = "needs_confirmation" if s["confidence"] == "inferred" else "ai_generated"

    return suggestions


def extract_from_document(filename, mime_type):
    """
    Placeholder OCR/document-understanding path for photo/screenshot/upload
    capture. Without a configured OCR/vision backend this returns a single
    review item pointing at the stored file so nothing is lost — the
    caregiver can still confirm/edit/discard it, per the capture-first
    principle. Wire a real OCR or vision-model call in here.
    """
    label = {
        "photo": "Photo captured",
        "screenshot": "Screenshot captured",
        "upload": "Document uploaded",
    }
    kind = "document"
    if mime_type and mime_type.startswith("image/"):
        kind = "document"
    return [{
        "type": "document",
        "title": f"Review captured file: {filename}",
        "summary": "Jalia saved this file. Add a note or confirm what it contains so it's easy to find later.",
        "details": {"filename": filename, "mimeType": mime_type},
        "confidence": "inferred",
        "provenance": "needs_confirmation",
    }]
