import os
from flask import Flask, jsonify
from sqlalchemy import inspect, text

from config import Config
from extensions import db, cors


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    os.makedirs(app.config["UPLOAD_DIR"], exist_ok=True)

    db.init_app(app)

    # Frontend development servers
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
    ]

    # Production frontend URL from Render environment variables
    frontend_url = os.environ.get("JALIA_FRONTEND_URL")
    if frontend_url:
        origins.append(frontend_url)

    cors.init_app(
        app,
        supports_credentials=True,
        origins=origins,
    )

    from auth import auth_bp
    from api import api_bp
    from uploads_api import uploads_bp
    from public_api import public_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(uploads_bp)
    app.register_blueprint(public_bp)

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": getattr(e, "description", "Not found.")}), 404

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"error": getattr(e, "description", "Forbidden.")}), 403

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": getattr(e, "description", "Bad request.")}), 400

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "product": "Jalia Healthcare"})

    with app.app_context():
        db.create_all()
        _add_missing_columns()

    return app


def _add_missing_columns():
    """
    Lightweight, dependency-free migration for the one case this project
    actually needs: adding a couple of nullable columns to a table that
    already exists on a deployed database. db.create_all() only creates
    tables that don't exist yet — it never alters existing ones — so
    without this, a fresh model column (like Handoff.share_token) would
    work locally on a brand-new SQLite file but throw "no such column" on
    Render's already-seeded database. If this project grows much further,
    swap this for a real migration tool (Flask-Migrate/Alembic).
    """
    inspector = inspect(db.engine)
    existing = {c["name"] for c in inspector.get_columns("handoffs")}
    additions = {
        "share_token": "VARCHAR(64)",
        "share_expires_at": "DATETIME",
    }
    with db.engine.begin() as conn:
        for column, col_type in additions.items():
            if column not in existing:
                conn.execute(text(f"ALTER TABLE handoffs ADD COLUMN {column} {col_type}"))


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5001)