from flask import abort, make_response
from config import db
from models import Responsibility, responsibility_schema, Document

def read_one(responsibility_id):
    responsibility = Responsibility.query.get(responsibility_id)
    if responsibility:
        return responsibility_schema.dump(responsibility)
    else:
        abort(
            404, f"Responsibility with ID {responsibility_id} not found"
        )

def create(responsibility):
    document_id = responsibility.get("document_id")
    document = Document.query.get(document_id)
    if document:
        new_responsibility = responsibility_schema.load(responsibility, session=db.session)
        document.responsibility.append(new_responsibility)
        db.session.commit()
        return responsibility_schema.dump(new_responsibility), 201
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(responsibility_id, responsibility):
    existing_responsibility = Responsibility.query.get(responsibility_id)
    if existing_responsibility:
        update_responsibility = responsibility_schema.load(responsibility, 
                                         session=db.session)
        existing_responsibility.surname = update_responsibility.surname
        existing_responsibility.name = update_responsibility.name
        existing_responsibility.authority = update_responsibility.authority
        existing_responsibility.role = update_responsibility.role
        db.session.merge(existing_responsibility)
        db.session.commit()
        return responsibility_schema.dump(existing_responsibility), 201
    else:
        abort(404, f"Error: responsibility with ID = {responsibility_id} not found")

def delete(responsibility_id):
    existing_responsibility = Responsibility.query.get(responsibility_id)
    if existing_responsibility:
        db.session.delete(existing_responsibility)
        db.session.commit()
        return make_response("Success: responsibility deleted")
    else:
        abort(404, f"Error: responsibility with ID {responsibility_id} not found")