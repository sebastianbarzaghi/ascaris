from flask import abort, make_response
from config import db
from models import PubAuthority, pubAuthority_schema, Document

def read_one(pubAuthority_id):
    pubAuthority = PubAuthority.query.get(pubAuthority_id)
    if pubAuthority:
        return pubAuthority_schema.dump(pubAuthority)
    else:
        abort(
            404, f"pubAuthority with ID {pubAuthority_id} not found"
        )

def create(pubAuthority):
    document_id = pubAuthority.get("document_id")
    document = Document.query.get(document_id)
    if document:
        new_pubAuthority = pubAuthority_schema.load(pubAuthority, session=db.session)
        document.pubAuthority.append(new_pubAuthority)
        db.session.commit()
        return pubAuthority_schema.dump(new_pubAuthority), 201
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(pubAuthority_id, pubAuthority):
    existing_pubAuthority = PubAuthority.query.get(pubAuthority_id)
    if existing_pubAuthority:
        update_pubAuthority = pubAuthority_schema.load(pubAuthority, 
                                         session=db.session)
        existing_pubAuthority.name = update_pubAuthority.name
        existing_pubAuthority.authority = update_pubAuthority.authority
        existing_pubAuthority.role = update_pubAuthority.role
        db.session.merge(existing_pubAuthority)
        db.session.commit()
        return pubAuthority_schema.dump(existing_pubAuthority), 201
    else:
        abort(404, f"Error: pubAuthority with ID = {pubAuthority_id} not found")

def delete(pubAuthority_id):
    existing_pubAuthority = PubAuthority.query.get(pubAuthority_id)
    if existing_pubAuthority:
        db.session.delete(existing_pubAuthority)
        db.session.commit()
        return make_response("Success: pubAuthority deleted")
    else:
        abort(404, f"Error: pubAuthority with ID {pubAuthority_id} not found")