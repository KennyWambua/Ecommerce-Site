from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField, EmailField
from wtforms.validators import DataRequired, Email

class OrderForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    address = TextAreaField('Address', validators=[DataRequired()])