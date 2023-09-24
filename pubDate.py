from flask import abort, make_response
from config import db
from models import PubDate, pubDate_schema, Document

def read_one(pubDate_id):
    pubDate = PubDate.query.get(pubDate_id)
    if pubDate:
        return pubDate_schema.dump(pubDate)
    else:
        abort(
            404, f"pubDate with ID {pubDate_id} not found"
        )

def create(pubDate):
    document_id = pubDate.get("document_id")
    document = Document.query.get(document_id)
    existing_pubDate = PubDate.query.filter_by(document_id=document_id).one_or_none()
    if document:
        if not existing_pubDate:
            new_pubDate = pubDate_schema.load(pubDate, session=db.session)
            document.pubDate = new_pubDate
            db.session.commit()
            return pubDate_schema.dump(new_pubDate), 201
        else:
            abort(404, f"Error: pubDate for document with ID {document_id} already exists")
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(pubDate_id, pubDate):
    existing_pubDate = PubDate.query.get(pubDate_id)
    if existing_pubDate:
        update_pubDate = pubDate_schema.load(pubDate, 
                                         session=db.session)
        existing_pubDate.date = update_pubDate.date
        db.session.merge(existing_pubDate)
        db.session.commit()
        return pubDate_schema.dump(existing_pubDate), 201
    else:
        abort(404, f"Error: pubDate with ID {pubDate_id} not found")

def delete(pubDate_id):
    existing_pubDate = PubDate.query.get(pubDate_id)
    if existing_pubDate:
        db.session.delete(existing_pubDate)
        db.session.commit()
        return make_response("Success: pubDate deleted")
    else:
        abort(404, f"Error: pubDate with ID {pubDate_id} not found")