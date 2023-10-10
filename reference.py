from flask import abort, make_response
from config import db
from models import Reference, reference_schema, Document, Entity

def read_one(reference_id):
    reference = Reference.query.get(reference_id)
    if reference:
        return reference_schema.dump(reference)
    else:
        abort(
            404, 
            f"reference with ID {reference_id} not found"
        )

def create(reference):
    document_id = reference.get("document_id")
    entity_id = reference.get("entity_id")
    document = Document.query.get(document_id)
    entity = Entity.query.get(entity_id)
    if document and entity:
        new_reference = reference_schema.load(reference, session=db.session)
        #document.reference.append(new_reference)
        entity.reference.append(new_reference)
        db.session.commit()
        return reference_schema.dump(new_reference), 201
    else:
        abort(
            404, 
            f"Error: document with ID {document_id} or entity with ID {entity_id} not found"
        )

def update(reference_id, reference):
    existing_reference = Reference.query.get(reference_id)
    if existing_reference:
        update_reference = reference_schema.load(reference, 
                                         session=db.session)
        existing_reference.text = update_reference.text
        existing_reference.type = update_reference.type
        db.session.merge(existing_reference)
        db.session.commit()
        return reference_schema.dump(existing_reference), 201
    else:
        abort(
            404, 
            f"Error: reference with ID = {reference_id} not found"
        )

def delete(reference_id):
    existing_reference = Reference.query.get(reference_id)
    if existing_reference:
        db.session.delete(existing_reference)
        db.session.commit()
        return make_response("Success: reference deleted")
    else:
        abort(
            404, 
            f"Error: reference with ID {reference_id} not found"
        )