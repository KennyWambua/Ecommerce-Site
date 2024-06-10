from flask import Blueprint, render_template, request, redirect, session, url_for, flash
from flask_login import login_required, current_user, login_user, logout_user
from . import db
from .models import Product, Order, OrderDetails

auth = Blueprint('auth', __name__)

@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/login', methods=['POST'])
def login_post():
    # login_user(user)
    # session['user_id'] = user.id
    flash('Login successful', 'success')
    return redirect(url_for('main.clothing'))







@auth.route('/logout')
@login_required
def logout():
    logout_user()
    session.pop('user_id', None)
    return redirect(url_for('main.index'))