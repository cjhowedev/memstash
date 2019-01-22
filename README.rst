MemStash
=========

MemStash is an open source Flask and React application for helping you maintain
your mental context through short, frequent notes.

Development
------------

To get started developing, first set up and activate a Python virtualenv, then
install the dependencies using ``yarn`` and ``pip``::

    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    pip install -r requirements-dev.txt
    yarn

Now, you can run the application in two separate terminals. Start the Flask
backend server::

    flask run

And start the React frontend, which automatically sets up a proxy to the Flask
server::

    yarn start

This should automatically open the application in your browser window. Both
environments should automatically reload.

Deployment
-----------

To deploy the Flask application, you can simply use the setup.py script to build
a distribution. Make sure you have ``wheel`` installed  and build the wheel
distribution::

    # if you don't have wheel:
    # pip install wheel
    python setup.py bdist_wheel
