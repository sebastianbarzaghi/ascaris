from flask import abort, make_response
from config import db
from models import Title, title_schema, Document

def read_one(title_id):
    title = Title.query.get(title_id)
    if title:
        return title_schema.dump(title)
    else:
        abort(
            404, f"Title with ID {title_id} not found"
        )

def create(title):
    document_id = title.get("document_id")
    document = Document.query.get(document_id)
    if document:
        new_title = title_schema.load(title, session=db.session)
        document.title.append(new_title)
        db.session.commit()
        return title_schema.dump(new_title), 201
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(title_id, title):
    existing_title = Title.query.get(title_id)
    if existing_title:
        update_title = title_schema.load(title, 
                                         session=db.session)
        existing_title.text = update_title.text
        existing_title.language = update_title.language
        db.session.merge(existing_title)
        db.session.commit()
        return title_schema.dump(existing_title), 201
    else:
        abort(404, f"Error: title with ID = {title_id} not found")

def delete(title_id):
    existing_title = Title.query.get(title_id)
    if existing_title:
        db.session.delete(existing_title)
        db.session.commit()
        return make_response("Success: title deleted")
    else:
        abort(404, f"Error: title with ID {title_id} not found")