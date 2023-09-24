from flask import abort, make_response
from config import db
from models import Category, category_schema, Document

def read_one(category_id):
    category = Category.query.get(category_id)
    if category:
        return category_schema.dump(category)
    else:
        abort(
            404, f"category with ID {category_id} not found"
        )

def create(category):
    document_id = category.get("document_id")
    document = Document.query.get(document_id)
    if document:
        new_category = category_schema.load(category, session=db.session)
        document.category.append(new_category)
        db.session.commit()
        return category_schema.dump(new_category), 201
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(category_id, category):
    existing_category = Category.query.get(category_id)
    if existing_category:
        update_category = category_schema.load(category, 
                                         session=db.session)
        existing_category.type = update_category.type
        db.session.merge(existing_category)
        db.session.commit()
        return category_schema.dump(existing_category), 201
    else:
        abort(404, f"Error: category with ID = {category_id} not found")

def delete(category_id):
    existing_category = Category.query.get(category_id)
    if existing_category:
        db.session.delete(existing_category)
        db.session.commit()
        return make_response("Success: category deleted")
    else:
        abort(404, f"Error: category with ID {category_id} not found")