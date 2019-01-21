import logging
from datetime import datetime, timedelta

from flask import Flask, g, jsonify, request, session
from flask_migrate import Migrate
from raven.contrib.flask import Sentry
from sqlalchemy.exc import IntegrityError
from webargs.flaskparser import parser
from werkzeug.exceptions import Forbidden, NotFound, UnprocessableEntity

from .model import Note, User, db
from .schema import LoginSchema, NoteSchema, UserSchema

app = Flask(__name__)
sentry = Sentry()

app.url_map.strict_slashes = False
app.config.from_object('memstash.default_settings')
app.config.from_envvar('MEMSTASH_SETTINGS', silent=True)


@app.before_first_request
def init_sentry():
    sentry.init_app(
        app,
        dsn=app.config['SENTRY_DSN'],
        logging=True,
        level=logging.ERROR
    )


db.init_app(app)
migrate = Migrate(app, db)

route_prefix = '/api'


def get_user():
    if 'username' in session:
        user = db.session.query(User).filter_by(
            username=session['username']
        ).first()
        if user is None:
            raise Forbidden(
                'Your session is invalid. Please log out and log back in.'
            )
        else:
            return user
    else:
        raise Forbidden('Please log in to access this API')


def get_note(id):
    user = get_user()
    note = db.session.query(Note).filter_by(id=id).first()
    if note is None:
        raise NotFound('No note with the given ID exists')
    elif user is not note.author:
        raise Forbidden('It is forbidden to change other users\' notes')
    return note


@app.route(route_prefix + '/user', methods=['POST'])
def signup():
    schema = UserSchema()
    user = parser.parse(schema, request, locations=['json'])
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError as e:
        if e.orig.diag.constraint_name == 'users_pkey':
            raise UnprocessableEntity('That username already exists')
        else:
            raise e
    else:
        session['username'] = user.username
        return jsonify(schema.dump(user).data)


@app.route(route_prefix + '/user', methods=['GET'])
def current_user():
    user = get_user()
    return jsonify(UserSchema().dump(user).data)


@app.route(route_prefix + '/session', methods=['POST'])
def login():
    login_form = parser.parse(LoginSchema(), request, locations=['json'])
    user = db.session.query(User).filter_by(
        username=login_form['username'].lower()
    ).first()
    if user is None or not user.check_password(login_form['password']):
        raise Forbidden('Username or password is incorrect')
    else:
        session['username'] = user.username
        return jsonify(UserSchema().dump(user).data)


@app.route(route_prefix + '/session', methods=['DELETE'])
def logout():
    if 'username' in session:
        del session['username']
    return jsonify(success=True)


@app.route(route_prefix + '/user/<string:username>/notes')
def public_notes_for_user(username):
    user = db.session.query(User).filter_by(
        username=username
    ).first()
    if user is None:
        raise NotFound("The user " + username + " does not exist")
    else:
        notes = db.session.query(Note).filter(
            Note.author == user,
            # only shows public notes from the past week
            Note.public == True,
            Note.created_at > datetime.utcnow() - timedelta(weeks=1)
        ).order_by(Note.created_at.desc()).all()
        return jsonify(
            NoteSchema(
                many=True,
                # exclude created_at for privacy and public as it is always true
                exclude=['public', 'created_at']
            ).dump(notes).data
        ), 200 if len(notes) > 0 else 404


@app.route(route_prefix + '/user/notes')
def notes_for_user():
    user = get_user()
    notes = db.session.query(Note).filter(
        Note.author == user,
        # only shows notes from the past week
        Note.created_at > datetime.utcnow() - timedelta(weeks=1)
    ).order_by(Note.created_at.desc()).all()
    return jsonify(
        NoteSchema(many=True).dump(notes).data
    ), 200 if len(notes) > 0 else 404


@app.route(route_prefix + '/notes', methods=['POST'])
def create_note():
    user = get_user()
    note = parser.parse(NoteSchema(), request, locations=['json'])
    note.author = user
    db.session.add(note)
    db.session.commit()
    return jsonify(NoteSchema().dump(note).data)


@app.route(route_prefix + '/notes/<int:id>', methods=['DELETE'])
def delete_note(id):
    note = get_note(id)
    db.session.delete(note)
    db.session.commit()
    return jsonify(NoteSchema().dump(note).data)


@app.route(route_prefix + '/notes/<int:id>/share', methods=['POST'])
def share_note(id):
    note = get_note(id)
    note.public = not note.public
    db.session.commit()
    return jsonify(NoteSchema().dump(note).data)


@app.errorhandler(400)
@app.errorhandler(422)
def bad_request(err):
    try:
        headers = err.data.get('headers', None)
        messages = err.data.get('messages', [err.description])
    except AttributeError:
        headers = None
        messages = [err.description]
    body = jsonify(
        error='BAD_REQUEST' if err.code == 400 else 'UNPROCESSABLE_ENTITY',
        messages=messages
    )
    if headers:
        return body, err.code, headers
    else:
        return body, err.code


@app.errorhandler(403)
def not_found(err):
    return jsonify(error='FORBIDDEN', messages=[err.description]), 403


@app.errorhandler(404)
def not_found(err):
    return jsonify(error='NOT_FOUND', messages=[err.description]), 404


@app.errorhandler(405)
def method_not_allowed(err):
    return jsonify(error='METHOD_NOT_ALLOWED', messages=[err.description]), 405


@app.errorhandler(500)
def internal_server_error(err):
    if g.sentry_event_id:
        messages = [
            ('An unknown error has occured. Please try again. '
             'If the problem persists, please contact support with your error '
             'event identifier at hand. Your error event identifier is ') +
            g.sentry_event_id
        ]
    else:
        messages = ['An unknown error has occured. Please try again.']
    return jsonify(
        error='INTERNAL_SERVER_ERROR',
        messages=messages
    ), 500


if __name__ == '__main__':
    app.run()
