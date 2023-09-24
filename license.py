from flask import abort, make_response
from config import db
from models import License, license_schema, Document

def read_one(license_id):
    license = License.query.get(license_id)
    if license:
        return license_schema.dump(license)
    else:
        abort(
            404, f"license with ID {license_id} not found"
        )

def create(license):
    document_id = license.get("document_id")
    document = Document.query.get(document_id)
    existing_license = License.query.filter_by(document_id=document_id).one_or_none()
    if document:
        if not existing_license:
            new_license = license_schema.load(license, session=db.session)
            document.license = new_license
            db.session.commit()
            return license_schema.dump(new_license), 201
        else:
            abort(409, f"Error: license for document with ID {document_id} already exists")
    else:
        abort(404, f"Error: document with ID {document_id} not found")

def update(license_id, license):
    existing_license = License.query.get(license_id)
    if existing_license:
        update_license = license_schema.load(license, 
                                         session=db.session)
        existing_license.text = update_license.text
        existing_license.link = update_license.link
        db.session.merge(existing_license)
        db.session.commit()
        return license_schema.dump(existing_license), 201
    else:
        abort(404, f"Error: license with ID {license_id} not found")

def delete(license_id):
    existing_license = License.query.get(license_id)
    if existing_license:
        db.session.delete(existing_license)
        db.session.commit()
        return make_response("Success: license deleted")
    else:
        abort(404, f"Error: license with ID {license_id} not found")