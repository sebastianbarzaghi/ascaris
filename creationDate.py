from flask import abort, make_response
from config import db
from models import CreationDate, creationDate_schema, Document

def read_one(creationDate_id):
    creationDate = CreationDate.query.get(creationDate_id)
    if creationDate:
        return creationDate_schema.dump(creationDate)
    else:
        abort(
            404, f"creationDate with ID {creationDate_id} not found"
        )

def create(creationDate):
    document_id = creationDate.get("document_id")
    document = Document.query.get(document_id)
    if document:
        new_creationDate = creationDate_schema.load(creationDate, session=db.session)
        document.creationDate.append(new_creationDate)
        db.session.commit()
        return creationDate_schema.dump(new_creationDate), 201
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(creationDate_id, creationDate):
    existing_creationDate = CreationDate.query.get(creationDate_id)
    if existing_creationDate:
        update_creationDate = creationDate_schema.load(creationDate, 
                                         session=db.session)
        existing_creationDate.date = update_creationDate.date
        db.session.merge(existing_creationDate)
        db.session.commit()
        return creationDate_schema.dump(existing_creationDate), 201
    else:
        abort(404, f"Error: creationDate with ID {creationDate_id} not found")

def delete(creationDate_id):
    existing_creationDate = CreationDate.query.get(creationDate_id)
    if existing_creationDate:
        db.session.delete(existing_creationDate)
        db.session.commit()
        return make_response("Success: creationDate deleted")
    else:
        abort(404, f"Error: creationDate with ID {creationDate_id} not found")