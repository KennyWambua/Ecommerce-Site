from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from . import db
from .models import Product, Order, OrderDetails

auth = Blueprint('auth', __name__)

@auth.route('/login')
def login():
    return render_template('login.html')