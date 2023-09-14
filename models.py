from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    docTitle = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    
    title = db.relationship('Title', backref='document', lazy=True)
    resp = db.relationship('Resp', backref='document', lazy=True)
    pubAuthority = db.relationship('PubAuthority', backref='document', lazy=True)
    pubPlace = db.relationship('PubPlace', backref='document', lazy=True)
    pubDate = db.relationship('PubDate', backref='document', lazy=True)
    identifier = db.relationship('Identifier', backref='document', lazy=True)
    availability = db.relationship('Availability', backref='document', lazy=True)
    source = db.relationship('Source', backref='document', lazy=True)
    note = db.relationship('Note', backref='document', lazy=True)
    description = db.relationship('Description', backref='document', lazy=True)
    abstract = db.relationship('Abstract', backref='document', lazy=True)
    creationPlace = db.relationship('CreationPlace', backref='document', lazy=True)
    creationDate = db.relationship('CreationDate', backref='document', lazy=True)
    language = db.relationship('Language', backref='document', lazy=True)
    category = db.relationship('Category', backref='document', lazy=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Document {self.id}>"
    
class Title(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)
    language = db.Column(db.String)
    type = db.Column(db.String)
    level = db.Column(db.String)

class Resp(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    surname = db.Column(db.String)
    name = db.Column(db.String)
    authority = db.Column(db.String)
    role = db.Column(db.String)

class PubAuthority(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    name = db.Column(db.String)
    authority = db.Column(db.String)
    role = db.Column(db.String)

class PubPlace(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    name = db.Column(db.String)
    authority = db.Column(db.String)

class PubDate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    date = db.Column(db.DateTime)

class Identifier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)
    type = db.Column(db.String)

class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)
    link = db.Column(db.String)
    status = db.Column(db.String)

class Source(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)

class Description(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)

class Abstract(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)

class CreationPlace(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    name = db.Column(db.String)
    authority = db.Column(db.String)

class CreationDate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    date = db.Column(db.DateTime)

class Language(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)
    ident = db.Column(db.String)
    usage = db.Column(db.String)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    type = db.Column(db.String)