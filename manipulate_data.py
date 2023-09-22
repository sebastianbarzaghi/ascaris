from models import db, Document, Title, Responsibility, PubAuthority, PubPlace, PubDate, Identifier, License, Source, Note, Description, Abstract, CreationPlace, CreationDate, Language, Category
from datetime import datetime
from flask import request

def get_data(document_id):
    
    data = {}

    titles = Title.query.filter_by(document_id=document_id).all()
    responsibilities = Responsibility.query.filter_by(document_id=document_id).all()
    pubAuthorities = PubAuthority.query.filter_by(document_id=document_id).all()
    pubPlace = PubPlace.query.filter_by(document_id=document_id).first()
    identifiers = Identifier.query.filter_by(document_id=document_id).all()
    pubDate = PubDate.query.filter_by(document_id=document_id).first()
    license = License.query.filter_by(document_id=document_id).first()
    notes = Note.query.filter_by(document_id=document_id).all()
    sources = Source.query.filter_by(document_id=document_id).all()
    abstract = Abstract.query.filter_by(document_id=document_id).first()
    creationDate = CreationDate.query.filter_by(document_id=document_id).first()
    categories = Category.query.filter_by(document_id=document_id).all()

    document = Document.query.filter_by(id=document_id).first()


    if titles:
        data['titles'] = []
        for title in titles:
            data['titles'].append({
                'id': title.id,
                'text': title.text,
                'language': title.language,
            })
    
    if responsibilities:
        data['responsibilities'] = []
        for responsibility in responsibilities:
            data['responsibilities'].append({
                'surname': responsibility.surname,
                'name': responsibility.name,
                'authority': responsibility.authority,
                'role': responsibility.role
            })

    if pubAuthorities:
        data['pubAuthorities'] = []
        for pubAuthority in pubAuthorities:
            data['pubAuthorities'].append({
                'name': pubAuthority.name,
                'authority': pubAuthority.authority,
                'role': pubAuthority.role
            })

    if pubPlace:
        data['pubPlace'] = {
            'name': pubPlace.name,
            'authority': pubPlace.authority
        }

    if identifiers:
        data['identifiers'] = []
        for identifier in identifiers:
            data['identifiers'].append({
                'id': identifier.id,
                'text': identifier.text,
                'type': identifier.type
            })
    
    if pubDate:
        data['pubDate'] = {
            'date': pubDate.date
        }

    if license:
        data['license'] = {
            'text': license.text,
            'link': license.link
        }

    if notes:
        data['notes'] = []
        for note in notes:
            data['notes'].append({
                'id': note.id,
                'text': note.text
            })
    
    if sources:
        data['sources'] = []
        for source in sources:
            data['sources'].append({
                'id': source.id,
                'text': source.text
            })

    if abstract:
        data['abstract'] = {
            'text': abstract.text
        }

    if creationDate:
        data['creationDate'] = {
            'date': creationDate.date
        }
    
    if categories:
        data['categories'] = []
        for category in categories:
            data['categories'].append({
                'type': category.type
        })

    if document:
        data['document'] = {
            'id': document.id,
            'content': document.content
        }

    return data


def update_or_add_data(fields, model, document_id):
    existing_fields = model.query.filter_by(document_id=document_id).all()
    model_fields_list = [{field: request.form.getlist(field)[i] for field in fields} for i in range(len(request.form.getlist(fields[0])))]
    processed_fields = {}
    for i, existing_field in enumerate(existing_fields):
        if model == Title:
            existing_field.text = model_fields_list[i]['title-text']
            existing_field.language = model_fields_list[i]['title-language']
        elif model == Responsibility:
            existing_field.surname = model_fields_list[i]['responsibility-surname']
            existing_field.name = model_fields_list[i]['responsibility-name']
            existing_field.authority = model_fields_list[i]['responsibility-authority']
            existing_field.role = model_fields_list[i]['responsibility-role']
        elif model == PubAuthority:
            existing_field.name = model_fields_list[i]['pubAuthority-name']
            existing_field.authority = model_fields_list[i]['pubAuthority-authority']
            existing_field.role = model_fields_list[i]['pubAuthority-role']
        elif model == Identifier:
            existing_field.text = model_fields_list[i]['identifier-text']
            existing_field.type = model_fields_list[i]['identifier-type']
        elif model == Note:
            existing_field.text = model_fields_list[i]['note-text']
        elif model == Category:
            existing_field.type = model_fields_list[i]['category-type']
        elif model == Source:
            existing_field.text = model_fields_list[i]['source-text']
        elif model == PubPlace:
            existing_field.name = model_fields_list[i]['pubPlace-name']
            existing_field.authority = model_fields_list[i]['pubPlace-authority']
        elif model == PubDate:
            existing_field.date = datetime.strptime(model_fields_list[i]['pubDate-date'], '%Y-%m-%d')
        elif model == License:
            existing_field.text = model_fields_list[i]['license-text']
            existing_field.link = model_fields_list[i]['license-link']
        elif model == Abstract:
            existing_field.text = model_fields_list[i]['abstract-text']
        elif model == CreationDate:
            existing_field.date = datetime.strptime(model_fields_list[i]['creationDate-date'], '%Y-%m-%d')
        processed_fields[i + 1] = True
        
    for i, model_fields_dict in enumerate(model_fields_list):
        if not all(value == '' or value is None for value in model_fields_dict.values()):
            if i + 1 not in processed_fields:
                if model == Title:
                    new_field = Title(document_id=document_id,
                                        text=model_fields_dict['title-text'],
                                        language=model_fields_dict['title-language'])
                elif model == Responsibility:
                    new_field = Responsibility(document_id=document_id,
                                            surname=model_fields_dict['responsibility-surname'],
                                            name=model_fields_dict['responsibility-name'],
                                            authority=model_fields_dict['responsibility-authority'],
                                            role=model_fields_dict['responsibility-role'])
                elif model == PubAuthority:
                    new_field = PubAuthority(document_id=document_id,
                                            name=model_fields_dict['pubAuthority-name'],
                                            authority=model_fields_dict['pubAuthority-authority'],
                                            role=model_fields_dict['pubAuthority-role'])
                elif model == Identifier:
                    new_field = Identifier(document_id=document_id,
                                        text=model_fields_dict['identifier-text'],
                                        type=model_fields_dict['identifier-type'])
                elif model == Note:
                    new_field = Note(document_id=document_id,
                                    text=model_fields_dict['note-text'])
                elif model == Category:
                    new_field = Category(document_id=document_id,
                                        type=model_fields_dict['category-type'])
                elif model == Source:
                    new_field = Source(document_id=document_id,
                                        text=model_fields_dict['source-text'])                
                elif model == PubPlace:
                    new_field = PubPlace(document_id=document_id,
                                        name=model_fields_dict['pubPlace-name'],
                                        authority=model_fields_dict['pubPlace-authority'])
                elif model == PubDate:
                    new_field = PubDate(document_id=document_id,
                                        date=datetime.strptime(model_fields_dict['pubDate-date'], '%Y-%m-%d'))
                elif model == License:
                    new_field = License(document_id=document_id,
                                        text=model_fields_dict['license-text'],
                                        link=model_fields_dict['license-link'])
                elif model == Abstract:
                    new_field = Abstract(document_id=document_id,
                                        text=model_fields_dict['abstract-text'])
                elif model == CreationDate:
                    new_field = CreationDate(document_id=document_id,
                                            date=datetime.strptime(model_fields_dict['creationDate-date'], '%Y-%m-%d'))
                db.session.add(new_field)
