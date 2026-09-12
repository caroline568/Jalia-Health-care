import os
import uuid

from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename

from auth import require_auth

uploads_bp = Blueprint("uploads", __name__, url_prefix="/api")

ALLOWED_EXT = {"png", "jpg", "jpeg", "webp", "heic", "pdf", "gif", "webm", "m4a", "mp3", "wav", "ogg"}


def _ext_ok(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT


@uploads_bp.post("/uploads")
@require_auth
def upload_file(user):
    if "file" not in request.files:
        return jsonify({"error": "No file provided."}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected."}), 400
    if not _ext_ok(file.filename):
        return jsonify({"error": "Unsupported file type."}), 400

    upload_dir = current_app.config["UPLOAD_DIR"]
    os.makedirs(upload_dir, exist_ok=True)

    safe_name = secure_filename(file.filename)
    stored_name = f"{uuid.uuid4().hex}_{safe_name}"
    file.save(os.path.join(upload_dir, stored_name))

    return jsonify({
        "filename": file.filename,
        "storedName": stored_name,
        "url": f"/api/uploads/{stored_name}",
        "mimeType": file.mimetype,
    }), 201


@uploads_bp.get("/uploads/<stored_name>")
@require_auth
def get_upload(user, stored_name):
    upload_dir = current_app.config["UPLOAD_DIR"]
    return send_from_directory(upload_dir, stored_name)
