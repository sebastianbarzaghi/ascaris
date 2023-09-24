from flask import abort, make_response
from config import db
from models import Identifier, identifier_schema, Document

def read_one(identifier_id):
    identifier = Identifier.query.get(identifier_id)
    if identifier:
        return identifier_schema.dump(identifier)
    else:
        abort(
            404, f"identifier with ID {identifier_id} not found"
        )

def create(identifier):
    document_id = identifier.get("document_id")
    document = Document.query.get(document_id)
    if document:
        new_identifier = identifier_schema.load(identifier, session=db.session)
        document.identifier.append(new_identifier)
        db.session.commit()
        return identifier_schema.dump(new_identifier), 201
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(identifier_id, identifier):
    existing_identifier = Identifier.query.get(identifier_id)
    if existing_identifier:
        update_identifier = identifier_schema.load(identifier, 
                                         session=db.session)
        existing_identifier.text = update_identifier.text
        existing_identifier.type = update_identifier.type
        db.session.merge(existing_identifier)
        db.session.commit()
        return identifier_schema.dump(existing_identifier), 201
    else:
        abort(404, f"Error: identifier with ID = {identifier_id} not found")

def delete(identifier_id):
    existing_identifier = Identifier.query.get(identifier_id)
    if existing_identifier:
        db.session.delete(existing_identifier)
        db.session.commit()
        return make_response("Success: identifier deleted")
    else:
        abort(404, f"Error: identifier with ID {identifier_id} not found")