from flask import Flask, request
import secrets
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_session import Session
import requests

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = secrets.token_hex(16)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_FILE_DIR'] = '/tmp/flask_session'
    app.config['SESSION_PERMANENT'] = True 
    app.config['PERMANENT_SESSION_LIFETIME'] = 3600

    db.init_app(app)
    migrate.init_app(app, db)
    
    Session(app)
    

    # blueprint for auth routes
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)
    
    # blueprint for non-auth 
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
