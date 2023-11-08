from flask import make_response, abort, request
from config import db
from models import Image, image_schema, images_schema, Document

def read_all():
    images = Image.query.all()
    return images_schema.dump(images)

def read_all_document(document_id):
    images = Image.query.filter_by(document_id=document_id).all()
    return images_schema.dump(images)

def read_one(image_name):
    image = Image.query.get(image_name)
    if image:
        return image_schema.dump(image)
    else:
        abort(
            404, 
            f"Error: image with name = {image_name} not found"
        )

def create(image):
    document_id = image.get("document_id")
    document = Document.query.get(document_id)
    if document:
        new_image = image_schema.load(image, 
                                        session=db.session)
        document.image.append(new_image)
        db.session.commit()
        return image_schema.dump(new_image), 201
    else:
        abort(
            404, 
            f"Error: document with ID = {document_id} not found"
        )

def update(image_id, image):
    existing_image = Image.query.get(image_id)
    if existing_image:
        update_image = image_schema.load(image, 
                                           session=db.session)
        existing_image.name = update_image.name
        db.session.merge(existing_image)
        db.session.commit()
        return image_schema.dump(existing_image), 201
    else:
        abort(
            404, 
            f"Error: image with ID = {image_id} not found"
        )

def delete(image_id):
    existing_image = Image.query.get(image_id)
    if existing_image:
        db.session.delete(existing_image)
        db.session.commit()
        return make_response(f"Success: image with ID = {image_id} deleted")
    else:
        abort(
            404, 
            f"Error: image with ID = {image_id} not found"
        )