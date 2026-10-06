import base64
import os
import tempfile
import unittest

from app import create_app


class AccountApiTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.app = create_app(
            {
                "TESTING": True,
                "SECRET_KEY": "test-secret-key-that-is-not-used-outside-tests",
                "DATABASE_PATH": os.path.join(self.temp_dir.name, "test.db"),
                "ALLOWED_ORIGINS": {"http://localhost:5173"},
                "IS_PRODUCTION": False,
            }
        )
        self.client = self.app.test_client()

    def tearDown(self):
        self.temp_dir.cleanup()

    def csrf(self, client=None):
        response = (client or self.client).get("/api/auth/csrf")
        self.assertEqual(response.status_code, 200)
        return response.get_json()["csrfToken"]

    def register(self, client=None, email="person@example.com"):
        client = client or self.client
        token = self.csrf(client)
        response = client.post(
            "/api/auth/register",
            json={"name": "Jalia User", "email": email, "password": "a-long-test-passphrase"},
            headers={"X-CSRF-Token": token},
        )
        self.assertEqual(response.status_code, 201, response.get_json())
        return response.get_json()

    def test_health_and_guest_access(self):
        health = self.client.get("/api/health")
        self.assertEqual(health.status_code, 200)
        self.assertEqual(health.headers["Cache-Control"], "no-store")
        self.assertEqual(self.client.get("/api/auth/me").get_json(), {"user": None})
        self.assertEqual(self.client.get("/api/backup").status_code, 401)

    def test_mutations_require_csrf_and_registration_hashes_password(self):
        rejected = self.client.post(
            "/api/auth/register",
            json={"name": "Jalia User", "email": "person@example.com", "password": "a-long-test-passphrase"},
        )
        self.assertEqual(rejected.status_code, 403)

        result = self.register()
        self.assertEqual(result["user"]["email"], "person@example.com")
        self.assertTrue(self.client.get("/api/auth/me").get_json()["user"])
        with self.app.app_context():
            from database import database

            with database() as connection:
                user = connection.execute(
                    "SELECT password_hash FROM users WHERE email = ?",
                    ("person@example.com",),
                ).fetchone()
        self.assertNotEqual(user["password_hash"], "a-long-test-passphrase")
        self.assertTrue(self.client.get_cookie("jalia_session").http_only)

    def test_encrypted_backup_is_owned_and_logout_removes_access(self):
        self.register()
        token = self.csrf()
        envelope = {
            "salt": base64.b64encode(b"0123456789abcdef").decode(),
            "iv": base64.b64encode(b"0123456789ab").decode(),
            "ciphertext": base64.b64encode(b"encrypted health data, not plaintext").decode(),
        }
        saved = self.client.put(
            "/api/backup",
            json=envelope,
            headers={"X-CSRF-Token": token},
        )
        self.assertEqual(saved.status_code, 200, saved.get_json())
        self.assertEqual(self.client.get("/api/backup").get_json()["backup"]["ciphertext"], envelope["ciphertext"])

        other_client = self.app.test_client()
        self.register(other_client, "another@example.com")
        self.assertIsNone(other_client.get("/api/backup").get_json()["backup"])

        logout = self.client.post("/api/auth/logout", headers={"X-CSRF-Token": token})
        self.assertEqual(logout.status_code, 200)
        self.assertEqual(self.client.get("/api/backup").status_code, 401)

    def test_invalid_encrypted_backup_is_rejected(self):
        self.register()
        response = self.client.put(
            "/api/backup",
            json={"salt": "bad", "iv": "bad", "ciphertext": "bad"},
            headers={"X-CSRF-Token": self.csrf()},
        )
        self.assertEqual(response.status_code, 400)

    def test_disallowed_browser_origin_is_rejected(self):
        response = self.client.get(
            "/api/auth/csrf",
            headers={"Origin": "https://untrusted.example"},
        )
        self.assertEqual(response.status_code, 403)


if __name__ == "__main__":
    unittest.main()
