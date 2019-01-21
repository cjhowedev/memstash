import os

SECRET_KEY = os.getenv(
    'SECRET_KEY',
    default='eTrtmdrFNo7PbDKuC1nu+BbUZRn7rKnu'
)
SQLALCHEMY_DATABASE_URI = os.getenv(
    'DATABASE_URL',
    default='postgresql://localhost/memstash'
)
SQLALCHEMY_TRACK_MODIFICATIONS = False
SENTRY_DSN = os.getenv(
    'SENTRY_DSN'
)
