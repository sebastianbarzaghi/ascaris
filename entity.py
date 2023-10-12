from flask import make_response, abort, request
from config import db
from models import Document, Entity, entity_schema, entities_schema

def read_all(document_id):
    entities = Entity.query.filter_by(document_id=document_id).all()
    return entities_schema.dump(entities)

def read_one(entity_id):
    entity = Entity.query.get(entity_id)
    if entity:
        return entity_schema.dump(entity)
    else:
        abort(
            404, 
            f"Error: entity with ID = {id} not found"
        )

def create(entity):
    document_id = entity.get("document_id")
    document = Document.query.get(document_id)
    if document:
        new_entity = entity_schema.load(entity, 
                                        session=db.session)
        document.entity.append(new_entity)
        db.session.commit()
        return entity_schema.dump(new_entity), 201
    else:
        abort(
            404, 
            f"Error: document with ID = {document_id} not found"
        )

def update(entity_id, entity):
    existing_entity = Entity.query.get(entity_id)
    if existing_entity:
        update_entity = entity_schema.load(entity, 
                                           session=db.session)
        existing_entity.type = update_entity.type
        existing_entity.label = update_entity.label
        existing_entity.authority = update_entity.authority
        db.session.merge(existing_entity)
        db.session.commit()
        return entity_schema.dump(existing_entity), 201
    else:
        abort(
            404, 
            f"Error: entity with ID = {entity_id} not found"
        )

def delete(entity_id):
    existing_entity = Entity.query.get(entity_id)
    if existing_entity:
        db.session.delete(existing_entity)
        db.session.commit()
        return make_response(f"Success: entity with ID = {entity_id} deleted")
    else:
        abort(
            404, 
            f"Error: entity with ID = {entity_id} not found"
        )