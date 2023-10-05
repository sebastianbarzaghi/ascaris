from flask import abort, make_response
from config import db
from models import Abstract, abstract_schema, Document

def read_one(abstract_id):
    abstract = Abstract.query.get(abstract_id)
    if abstract:
        return abstract_schema.dump(abstract)
    else:
        abort(
            404, f"abstract with ID {abstract_id} not found"
        )

def create(abstract):
    document_id = abstract.get("document_id")
    document = Document.query.get(document_id)
    if document:
        new_abstract = abstract_schema.load(abstract, session=db.session)
        document.abstract.append(new_abstract)
        db.session.commit()
        return abstract_schema.dump(new_abstract), 201
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(abstract_id, abstract):
    existing_abstract = Abstract.query.get(abstract_id)
    if existing_abstract:
        update_abstract = abstract_schema.load(abstract, 
                                         session=db.session)
        existing_abstract.text = update_abstract.text
        db.session.merge(existing_abstract)
        db.session.commit()
        return abstract_schema.dump(existing_abstract), 201
    else:
        abort(404, f"Error: abstract with ID {abstract_id} not found")

def delete(abstract_id):
    existing_abstract = Abstract.query.get(abstract_id)
    if existing_abstract:
        db.session.delete(existing_abstract)
        db.session.commit()
        return make_response("Success: abstract deleted")
    else:
        abort(404, f"Error: abstract with ID {abstract_id} not found")