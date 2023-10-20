from flask import abort, make_response
from config import db
from models import Annotation, annotation_schema, Document, Reference

def read_one(annotation_id):
    annotation = Annotation.query.get(annotation_id)
    if annotation:
        return annotation_schema.dump(annotation)
    else:
        abort(
            404, 
            f"annotation with ID {annotation_id} not found"
        )

def create(annotation):
    document_id = annotation.get("document_id")
    reference_id = annotation.get("reference_id")
    document = Document.query.get(document_id)
    reference = Reference.query.get(reference_id)
    if document and reference:
        new_annotation = annotation_schema.load(annotation, session=db.session)
        reference.annotation.append(new_annotation)
        db.session.commit()
        return annotation_schema.dump(new_annotation), 201
    else:
        abort(
            404, 
            f"Error: document with ID {document_id} or reference with ID {reference_id} not found"
        )

def update(annotation_id, annotation):
    existing_annotation = Annotation.query.get(annotation_id)
    if existing_annotation:
        update_annotation = annotation_schema.load(annotation, 
                                         session=db.session)
        existing_annotation.text = update_annotation.text
        existing_annotation.language = update_annotation.language
        existing_annotation.motivation = update_annotation.motivation
        existing_annotation.license = update_annotation.license
        db.session.merge(existing_annotation)
        db.session.commit()
        return annotation_schema.dump(existing_annotation), 201
    else:
        abort(
            404, 
            f"Error: annotation with ID = {annotation_id} not found"
        )

def delete(annotation_id):
    existing_annotation = Annotation.query.get(annotation_id)
    if existing_annotation:
        db.session.delete(existing_annotation)
        db.session.commit()
        return make_response("Success: annotation deleted")
    else:
        abort(
            404, 
            f"Error: annotation with ID {annotation_id} not found"
        )