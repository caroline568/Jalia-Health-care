import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get("JALIA_SECRET_KEY", "dev-secret-change-me-in-production")

    # PostgreSQL-ready: set DATABASE_URL to a postgres:// URL in production.
    # Falls back to a local SQLite file for zero-config local development.
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'jalia.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SESSION_COOKIE_NAME = "jalia_session"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    # Set to True when served over HTTPS in production.
    SESSION_COOKIE_SECURE = os.environ.get("JALIA_COOKIE_SECURE", "false").lower() == "true"
    PERMANENT_SESSION_LIFETIME = timedelta(days=14)

    MAX_CONTENT_LENGTH = 20 * 1024 * 1024  # 20MB uploads (photos/voice notes)
    UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

    # Only Gmail addresses may register, enforced server-side.
    ALLOWED_EMAIL_DOMAINS = {"gmail.com"}
