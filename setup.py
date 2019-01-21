from setuptools import setup

setup(
    name='memstash',
    version="1.0",
    packages=['memstash'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'flask==1.0.2',
        'flask-migrate==2.3.1',
        'flask-sqlalchemy==2.3.2',
        'psycopg2-binary==2.7.6.1',
        'webargs==5.1.0',
        'marshmallow==2.18.0',
        'bcrypt==3.1.6',
        'raven[flask]==6.10.0',
        'passlib==1.7.1'
    ],
    package_data={
        'memstash': ['migrations/*', 'migrations/versions/*']
    }
)
