from flask import abort, make_response
from config import db
from models import Note, note_schema, Document

def read_one(note_id):
    note = Note.query.get(note_id)
    if note:
        return note_schema.dump(note)
    else:
        abort(
            404, f"note with ID {note_id} not found"
        )

def create(note):
    document_id = note.get("document_id")
    document = Document.query.get(document_id)
    if document:
        new_note = note_schema.load(note, session=db.session)
        document.note.append(new_note)
        db.session.commit()
        return note_schema.dump(new_note), 201
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(note_id, note):
    existing_note = Note.query.get(note_id)
    if existing_note:
        update_note = note_schema.load(note, 
                                         session=db.session)
        existing_note.text = update_note.text
        db.session.merge(existing_note)
        db.session.commit()
        return note_schema.dump(existing_note), 201
    else:
        abort(404, f"Error: note with ID = {note_id} not found")

def delete(note_id):
    existing_note = Note.query.get(note_id)
    if existing_note:
        db.session.delete(existing_note)
        db.session.commit()
        return make_response("Success: note deleted")
    else:
        abort(404, f"Error: note with ID {note_id} not found")