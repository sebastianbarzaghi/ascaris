from app import app, db

# create app context
with app.app_context():

    # create database tables
    db.create_all()