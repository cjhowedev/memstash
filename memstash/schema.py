from marshmallow import Schema, fields, post_load, validate

from .model import Note, User


class UserSchema(Schema):
    username = fields.String(
        required=True,
        error_messages={'required': 'A username is required'},
        validate=[
            validate.Length(
                min=3,
                max=64,
                error="Your username must be between 3 and 64 characters long"
            ),
            validate.Regexp(
                r"\A[A-Za-z0-9_]+\Z",
                error="Your username must contain only letters, numbers and "
                "underscores"
            )
        ]
    )

    password = fields.String(
        load_only=True,
        required=True,
        error_messages={'required': 'A password is required'},
        validate=[
            validate.Length(
                min=8,
                max=50,
                error="Your password must be between 8 and 50 characters long"
            )
        ]
    )

    @post_load
    def make_user(self, data):
        return User(data["username"].lower(), data["password"])

    class Meta:
        strict = True


class LoginSchema(Schema):
    username = fields.String(
        load_only=True,
        required=True,
        error_messages={'required': 'Your username is required'}
    )

    password = fields.String(
        load_only=True,
        required=True,
        error_messages={'required': 'Your password is required'}
    )

    class Meta:
        strict = True


class NoteSchema(Schema):
    id = fields.Integer(
        dump_only=True
    )

    created_at = fields.DateTime(
        dump_only=True
    )

    text = fields.String(
        required=True,
        error_messages={'required': 'The note\'s text is required'},
        validate=[
            validate.Regexp(
                regex=r"\S",
                error="The note must have non-whitespace text"
            )
        ]
    )

    public = fields.Boolean(
        dump_only=True
    )

    @post_load
    def make_note(self, data):
        return Note(text=data["text"])

    class Meta:
        strict = True
