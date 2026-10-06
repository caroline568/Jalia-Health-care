import os
import sqlite3
from contextlib import contextmanager

from flask import current_app


@contextmanager
def database():
    connection = sqlite3.connect(current_app.config["DATABASE_PATH"], timeout=10)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def initialize_database(app):
    database_path = app.config["DATABASE_PATH"]
    os.makedirs(os.path.dirname(os.path.abspath(database_path)), exist_ok=True)
    with app.app_context():
        with database() as connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
                    password_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS encrypted_backups (
                    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                    salt TEXT NOT NULL,
                    iv TEXT NOT NULL,
                    ciphertext TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS auth_attempts (
                    address_hash TEXT NOT NULL,
                    attempted_at INTEGER NOT NULL
                );
                CREATE INDEX IF NOT EXISTS auth_attempts_by_address
                    ON auth_attempts (address_hash, attempted_at);
                """
            )
