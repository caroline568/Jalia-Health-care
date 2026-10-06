import hashlib
import re
import secrets
import sqlite3
import time
import uuid
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash

from database import database

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PASSWORD_MIN_LENGTH = 12
ATTEMPT_WINDOW_SECONDS = 15 * 60
MAX_ATTEMPTS_PER_WINDOW = 20


def _user_dict(row):
    return {"id": row["id"], "name": row["name"], "email": row["email"]}


def require_user():
    user_id = session.get("user_id")
    if not user_id:
        return None
    with database() as connection:
        return connection.execute(
            "SELECT id, name, email FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()


def rate_limited(connection):
    now = int(time.time())
    address = request.remote_addr or "unknown"
    address_hash = hashlib.sha256(address.encode("utf-8")).hexdigest()
    connection.execute(
        "DELETE FROM auth_attempts WHERE attempted_at < ?",
        (now - ATTEMPT_WINDOW_SECONDS,),
    )
    attempts = connection.execute(
        "SELECT COUNT(*) AS count FROM auth_attempts WHERE address_hash = ? AND attempted_at >= ?",
        (address_hash, now - ATTEMPT_WINDOW_SECONDS),
    ).fetchone()["count"]
    if attempts >= MAX_ATTEMPTS_PER_WINDOW:
        return True
    connection.execute(
        "INSERT INTO auth_attempts (address_hash, attempted_at) VALUES (?, ?)",
        (address_hash, now),
    )
    return False


@auth_bp.get("/csrf")
def csrf_token():
    token = session.get("csrf_token")
    if not token:
        token = secrets.token_urlsafe(32)
        session["csrf_token"] = token
    return jsonify({"csrfToken": token})


@auth_bp.get("/me")
def me():
    user = require_user()
    return jsonify({"user": _user_dict(user) if user else None})


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Send account details as a JSON object."}), 400
    name = data.get("name", "").strip() if isinstance(data.get("name", ""), str) else ""
    email = data.get("email", "").strip().lower() if isinstance(data.get("email", ""), str) else ""
    password = data.get("password", "") if isinstance(data.get("password", ""), str) else ""

    if not name or len(name) > 120:
        return jsonify({"error": "Enter your name (up to 120 characters)."}), 400
    if len(email) > 254 or not EMAIL_RE.fullmatch(email):
        return jsonify({"error": "Enter a valid email address."}), 400
    if len(password) < PASSWORD_MIN_LENGTH or len(password) > 256:
        return jsonify({"error": "Choose a passphrase between 12 and 256 characters."}), 400

    now = datetime.now(timezone.utc).isoformat()
    user_id = uuid.uuid4().hex
    with database() as connection:
        if rate_limited(connection):
            return jsonify({"error": "Too many account attempts. Please try again later."}), 429
        try:
            connection.execute(
                "INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
                (user_id, name, email, generate_password_hash(password), now),
            )
        except sqlite3.IntegrityError as error:
            if "UNIQUE constraint failed" in str(error):
                return jsonify({"error": "An account with this email already exists."}), 409
            raise

    session.clear()
    session["user_id"] = user_id
    session["csrf_token"] = secrets.token_urlsafe(32)
    session.permanent = True
    return jsonify({
        "user": {"id": user_id, "name": name, "email": email},
        "csrfToken": session["csrf_token"],
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Send sign-in details as a JSON object."}), 400
    email = data.get("email", "").strip().lower() if isinstance(data.get("email", ""), str) else ""
    password = data.get("password", "") if isinstance(data.get("password", ""), str) else ""
    if len(password) > 256:
        return jsonify({"error": "Incorrect email or password."}), 401

    with database() as connection:
        if rate_limited(connection):
            return jsonify({"error": "Too many account attempts. Please try again later."}), 429
        user = connection.execute(
            "SELECT id, name, email, password_hash FROM users WHERE email = ?",
            (email,),
        ).fetchone()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Incorrect email or password."}), 401

    session.clear()
    session["user_id"] = user["id"]
    session["csrf_token"] = secrets.token_urlsafe(32)
    session.permanent = True
    return jsonify({"user": _user_dict(user), "csrfToken": session["csrf_token"]})


@auth_bp.post("/logout")
def logout():
    session.clear()
    session["csrf_token"] = secrets.token_urlsafe(32)
    return jsonify({"ok": True, "csrfToken": session["csrf_token"]})
