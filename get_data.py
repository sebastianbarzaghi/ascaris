from models import Document, Title, Responsibility, PubAuthority, PubPlace, PubDate, Identifier, License, Source, Note, Description, Abstract, CreationPlace, CreationDate, Language, Category

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
    description = Description.query.filter_by(document_id=document_id).first()
    abstract = Abstract.query.filter_by(document_id=document_id).first()
    creationPlace = CreationPlace.query.filter_by(document_id=document_id).first()
    creationDate = CreationDate.query.filter_by(document_id=document_id).first()
    languages = Language.query.filter_by(document_id=document_id).all()
    categories = Category.query.filter_by(document_id=document_id).all()

    document = Document.query.filter_by(id=document_id).first()


    if titles:
        data['titles'] = []
        for title in titles:
            data['titles'].append({
                'id': title.id,
                'text': title.text,
                'language': title.language,
                'type': title.type,
                'level': title.level
            })
    
    if responsibilities:
        data['responsibilities'] = []
        for responsibility in responsibilities:
            data['responsibilities'].append({
                'fullName': f'{responsibility.surname}, {responsibility.name}',
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

    if description:
        data['description'] = {
            'text': description.text
        }

    if abstract:
        data['abstract'] = {
            'text': abstract.text
        }

    if creationPlace:
        data['creationPlace'] = {
            'name': creationPlace.name,
            'authority': creationPlace.authority
        }

    if creationDate:
        data['creationDate'] = {
            'date': creationDate.date
        }

    if languages:
        data['languages'] = []
        for language in languages:
            data['languages'].append({
                'text': language.text,
                'ident': language.ident,
                'usage': language.usage
        })
    
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