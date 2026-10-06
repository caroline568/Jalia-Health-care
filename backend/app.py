import os
import secrets
from datetime import timedelta

from flask import Flask, jsonify, request, session

from database import initialize_database


def create_app(test_config=None):
    app = Flask(__name__)
    production = os.environ.get("JALIA_ENV", "").lower() == "production"
    secret_key = os.environ.get("JALIA_SECRET_KEY")
    if production and not secret_key:
        raise RuntimeError("JALIA_SECRET_KEY must be configured in production.")

    app.config.update(
        SECRET_KEY=secret_key or secrets.token_hex(32),
        DATABASE_PATH=os.environ.get(
            "JALIA_DATABASE_PATH",
            os.path.join(os.path.dirname(__file__), "jalia.db"),
        ),
        SESSION_COOKIE_NAME="jalia_session",
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SECURE=os.environ.get(
            "JALIA_COOKIE_SECURE", "true" if production else "false"
        ).lower() == "true",
        SESSION_COOKIE_SAMESITE=os.environ.get(
            "JALIA_COOKIE_SAMESITE", "None" if production else "Lax"
        ),
        PERMANENT_SESSION_LIFETIME=timedelta(days=14),
        MAX_CONTENT_LENGTH=1_400_000,
        IS_PRODUCTION=production,
    )
    if test_config:
        app.config.update(test_config)

    origins = {
        origin.strip().rstrip("/")
        for origin in os.environ.get("JALIA_FRONTEND_URL", "").split(",")
        if origin.strip()
    }
    if not app.config["IS_PRODUCTION"]:
        origins.update(
            {
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:4173",
                "http://127.0.0.1:4173",
            }
        )
    app.config["ALLOWED_ORIGINS"] = origins

    from auth import auth_bp
    from backup import backup_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(backup_bp)

    @app.before_request
    def protect_api_requests():
        if not request.path.startswith("/api/"):
            return None

        origin = request.headers.get("Origin")
        if origin and origin.rstrip("/") not in app.config["ALLOWED_ORIGINS"]:
            return jsonify({"error": "This origin is not allowed."}), 403

        if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
            expected = session.get("csrf_token")
            provided = request.headers.get("X-CSRF-Token")
            if not expected or not provided or not secrets.compare_digest(expected, provided):
                return jsonify({"error": "Your session expired. Refresh and try again."}), 403
        return None

    @app.after_request
    def set_api_headers(response):
        if request.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store"
            response.headers["Pragma"] = "no-cache"
        origin = request.headers.get("Origin")
        if origin and origin.rstrip("/") in app.config["ALLOWED_ORIGINS"]:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-CSRF-Token"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers.add("Vary", "Origin")
        if app.config["IS_PRODUCTION"]:
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "product": "Jalia Endometriosis Journey"})

    initialize_database(app)
    return app


app = create_app()

if __name__ == "__main__":
    app.run(port=5001)
