from flask import abort, make_response
from config import db
from models import PubPlace, pubPlace_schema, Document

def read_one(pubPlace_id):
    pubPlace = PubPlace.query.get(pubPlace_id)
    if pubPlace:
        return pubPlace_schema.dump(pubPlace)
    else:
        abort(
            404, f"pubPlace with ID {pubPlace_id} not found"
        )

def create(pubPlace):
    document_id = pubPlace.get("document_id")
    document = Document.query.get(document_id)
    existing_pubPlace = PubPlace.query.filter_by(document_id=document_id).one_or_none()
    if document:
        if not existing_pubPlace:
            new_pubPlace = pubPlace_schema.load(pubPlace, session=db.session)
            document.pubPlace = new_pubPlace
            db.session.commit()
            return pubPlace_schema.dump(new_pubPlace), 201
        else:
            abort(409, f"Error: pubPlace for document with ID {document_id} already exists")
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(pubPlace_id, pubPlace):
    existing_pubPlace = PubPlace.query.get(pubPlace_id)
    if existing_pubPlace:
        update_pubPlace = pubPlace_schema.load(pubPlace, 
                                         session=db.session)
        existing_pubPlace.name = update_pubPlace.name
        existing_pubPlace.authority = update_pubPlace.authority
        db.session.merge(existing_pubPlace)
        db.session.commit()
        return pubPlace_schema.dump(existing_pubPlace), 201
    else:
        abort(404, f"Error: pubPlace with ID {pubPlace_id} not found")

def delete(pubPlace_id):
    existing_pubPlace = PubPlace.query.get(pubPlace_id)
    if existing_pubPlace:
        db.session.delete(existing_pubPlace)
        db.session.commit()
        return make_response("Success: pubPlace deleted")
    else:
        abort(404, f"Error: pubPlace with ID {pubPlace_id} not found")