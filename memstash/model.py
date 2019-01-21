from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from passlib.hash import bcrypt

db = SQLAlchemy()


class TimestampMixin(object):
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)


class User(TimestampMixin, db.Model):
    __tablename__ = 'users'
    username = db.Column(db.Unicode(64), primary_key=True)
    # bcrypt hashes should be shorter than 80 unicode characters (not bytes)
    password = db.Column(db.Unicode(80), nullable=False)
    notes = db.relationship('Note', backref='author', lazy=True)

    def __init__(self, username, password):
        self.username = username
        self.password = bcrypt.hash(password)

    def check_password(self, password):
        return bcrypt.verify(password, self.password)


class Note(TimestampMixin, db.Model):
    __tablename__ = 'notes'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.UnicodeText, nullable=False)
    public = db.Column(db.Boolean, nullable=False, default=False)
    username = db.Column(
        db.Unicode(64),
        db.ForeignKey('users.username', name="notes_author_fkey"),
        nullable=False
    )
