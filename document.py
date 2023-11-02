from flask import make_response, abort, request
from config import db
from models import Document, document_schema, documents_schema

def read_all():
    documents = Document.query.order_by(Document.updated_at.desc())
    return documents_schema.dump(documents)

def read_one(id):
    document = Document.query.filter(Document.id == id).one_or_none()
    if document:
        return document_schema.dump(document)
    else:
        abort(404, f"Error: document with ID = {id} not found")

def create(document):
    id = document.get("id")
    existing_document = Document.query.filter(Document.id == id).one_or_none()
    if not existing_document:
        new_document = document_schema.load(document, session=db.session)
        db.session.add(new_document)
        db.session.commit()
        return document_schema.dump(new_document), 201
    else:
        abort(406, f"Error: document with ID = {id} already exists")

def update(id, document):
    existing_document = Document.query.filter(Document.id == id).one_or_none()
    if existing_document:
        update_document = document_schema.load(document, session=db.session)
        existing_document.docTitle = update_document.docTitle
        existing_document.content = update_document.content
        existing_document.image = update_document.image
        db.session.merge(existing_document)
        db.session.commit()
        return document_schema.dump(existing_document), 201
    else:
        abort(404, f"Error: document with ID = {id} not found")

def delete(id):
    existing_document = Document.query.filter(Document.id == id).one_or_none()
    if existing_document:
        db.session.delete(existing_document)
        db.session.commit()
        return make_response(f"Success: document with ID = {id} deleted")
    else:
        abort(404, f"Error: document with ID = {id} not found")
