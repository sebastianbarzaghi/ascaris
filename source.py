from flask import abort, make_response
from config import db
from models import Source, source_schema, Document

def read_one(source_id):
    source = Source.query.get(source_id)
    if source:
        return source_schema.dump(source)
    else:
        abort(
            404, f"source with ID {source_id} not found"
        )

def create(source):
    document_id = source.get("document_id")
    document = Document.query.get(document_id)
    if document:
        new_source = source_schema.load(source, session=db.session)
        document.source.append(new_source)
        db.session.commit()
        return source_schema.dump(new_source), 201
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(source_id, source):
    existing_source = Source.query.get(source_id)
    if existing_source:
        update_source = source_schema.load(source, 
                                         session=db.session)
        existing_source.text = update_source.text
        db.session.merge(existing_source)
        db.session.commit()
        return source_schema.dump(existing_source), 201
    else:
        abort(404, f"Error: source with ID = {source_id} not found")

def delete(source_id):
    existing_source = Source.query.get(source_id)
    if existing_source:
        db.session.delete(existing_source)
        db.session.commit()
        return make_response("Success: source deleted")
    else:
        abort(404, f"Error: source with ID {source_id} not found")