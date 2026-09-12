import os
from flask import Flask, jsonify

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

    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(uploads_bp)

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

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5001)
