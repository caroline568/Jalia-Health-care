import base64
import binascii
from datetime import datetime, timezone

from flask import Blueprint, jsonify, session, request

from auth import require_user
from database import database

backup_bp = Blueprint("backup", __name__, url_prefix="/api/backup")
MAX_CIPHERTEXT_BYTES = 1_000_000


def _decode_base64(value, expected_length=None):
    if not isinstance(value, str):
        return None
    try:
        decoded = base64.b64decode(value, validate=True)
    except (ValueError, binascii.Error):
        return None
    if expected_length is not None and len(decoded) != expected_length:
        return None
    return decoded


def _authenticated_user_id():
    user = require_user()
    return user["id"] if user else None


@backup_bp.get("")
def get_backup():
    user_id = _authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Sign in to access your encrypted backup."}), 401
    with database() as connection:
        backup = connection.execute(
            "SELECT salt, iv, ciphertext, updated_at FROM encrypted_backups WHERE user_id = ?",
            (user_id,),
        ).fetchone()
    return jsonify({"backup": dict(backup) if backup else None})


@backup_bp.put("")
def save_backup():
    user_id = _authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Sign in to save an encrypted backup."}), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Send an encrypted backup object."}), 400
    salt = data.get("salt")
    iv = data.get("iv")
    ciphertext = data.get("ciphertext")
    if not _decode_base64(salt, expected_length=16):
        return jsonify({"error": "The backup encryption salt is invalid."}), 400
    if not _decode_base64(iv, expected_length=12):
        return jsonify({"error": "The backup encryption nonce is invalid."}), 400
    encrypted_data = _decode_base64(ciphertext)
    if not encrypted_data or len(encrypted_data) < 16 or len(encrypted_data) > MAX_CIPHERTEXT_BYTES:
        return jsonify({"error": "The encrypted backup is invalid or too large."}), 400

    updated_at = datetime.now(timezone.utc).isoformat()
    with database() as connection:
        connection.execute(
            """
            INSERT INTO encrypted_backups (user_id, salt, iv, ciphertext, updated_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                salt = excluded.salt,
                iv = excluded.iv,
                ciphertext = excluded.ciphertext,
                updated_at = excluded.updated_at
            """,
            (user_id, salt, iv, ciphertext, updated_at),
        )
    return jsonify({"updatedAt": updated_at}), 200


@backup_bp.delete("")
def delete_backup():
    user_id = _authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Sign in to delete your encrypted backup."}), 401
    with database() as connection:
        connection.execute("DELETE FROM encrypted_backups WHERE user_id = ?", (user_id,))
    return jsonify({"ok": True})
