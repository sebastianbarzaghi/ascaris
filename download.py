import re
from bs4 import BeautifulSoup
from models import db, Document, Title, Resp, PubAuthority, PubPlace, PubDate, Identifier, Availability, Source, Note, Description, Abstract, CreationPlace, CreationDate, Language, Category

def get_data(document_id):
    
    data = {}

    titles = Title.query.filter_by(document_id=document_id).all()
    responsibilities = Resp.query.filter_by(document_id=document_id).all()
    pubAuthorities = PubAuthority.query.filter_by(document_id=document_id).all()
    pubPlace = PubPlace.query.filter_by(document_id=document_id).first()
    identifiers = Identifier.query.filter_by(document_id=document_id).all()
    pubDate = PubDate.query.filter_by(document_id=document_id).first()
    availability = Availability.query.filter_by(document_id=document_id).first()
    notes = Note.query.filter_by(document_id=document_id).all()
    sources = Source.query.filter_by(document_id=document_id).all()
    description = Description.query.filter_by(document_id=document_id).first()
    abstract = Abstract.query.filter_by(document_id=document_id).first()
    creationPlace = CreationPlace.query.filter_by(document_id=document_id).first()
    creationDate = CreationDate.query.filter_by(document_id=document_id).first()
    languages = Language.query.filter_by(document_id=document_id).all()
    categories = Category.query.filter_by(document_id=document_id).all()

    document = Document.query.filter_by(id=document_id).first()

    data['titles'] = []
    for title in titles:
        data['titles'].append({
            'id': title.id,
            'text': title.text,
            'lang': title.lang,
            'type': title.type,
            'level': title.level
        })
    
    data['responsibilities'] = []
    for responsibility in responsibilities:
        data['responsibilities'].append({
            'fullName': f'{responsibility.surname}, {responsibility.name}',
            'authority': responsibility.authority,
            'role': responsibility.role
        })
    
    data['pubAuthorities'] = []
    for pubAuthority in pubAuthorities:
        data['pubAuthorities'].append({
            'name': pubAuthority.name,
            'authority': pubAuthority.authority,
            'role': pubAuthority.role
        })

    data['pubPlace'] = {
        'name': pubPlace.name,
        'authority': pubPlace.authority
    }

    data['identifiers'] = []
    for identifier in identifiers:
        data['identifiers'].append({
            'id': identifier.id,
            'text': identifier.text,
            'type': identifier.type
        })
    
    data['pubDate'] = {
        'date': pubDate.date
    }

    data['availability'] = {
        'text': availability.text,
        'link': availability.link,
        'status': availability.status
    }

    data['notes'] = []
    for note in notes:
        data['notes'].append({
            'id': note.id,
            'text': note.text
        })
    
    data['sources'] = []
    for source in sources:
        data['sources'].append({
            'id': source.id,
            'text': source.text
        })
    
    data['description'] = {
        'text': description.text
    }

    data['abstract'] = {
        'text': abstract.text
    }

    data['creationPlace'] = {
        'name': creationPlace.name,
        'authority': creationPlace.authority
    }

    data['creationDate'] = {
        'date': creationDate.date
    }

    data['languages'] = []
    for language in languages:
        data['languages'].append({
            'text': language.text,
            'ident': language.ident,
            'usage': language.usage
        })
    
    data['categories'] = []
    for category in categories:
        data['categories'].append({
            'type': category.type
        })

    data['document'] = {
        'id': document.id,
        'content': document.content
    }

    return data


def generate_tei_titles(data):
    soup = BeautifulSoup()
    for title in data['titles']:
        title_tag = soup.new_tag('title')
        title_tag.string = title['text']
        title_tag['xml:id'] = f"title-{title['id']}"
        title_tag['lang'] = title['lang']
        title_tag['type'] = title['type']
        title_tag['level'] = title['level']
        soup.append(title_tag)
    return soup


def generate_tei_responsibilities(data):
    soup = BeautifulSoup()
    for responsibility in data['responsibilities']:
        if responsibility['role'] == 'other':
            print("other responsibility: TO DO")
        else:
            resp_tag = soup.new_tag(responsibility['role'])
        resp_tag.string = responsibility['fullName']
        resp_tag['sameAs'] = responsibility['authority']
        soup.append(resp_tag)
    return soup


def generate_tei_pub_authorities(data):
    soup = BeautifulSoup()
    for pub_authority in data['pubAuthorities']:
        if pub_authority['role'] == 'other':
            print("other responsibility: TO DO")
        else:
            pub_authority_tag = soup.new_tag(pub_authority['role'])
        pub_authority_tag.string = pub_authority['name']
        pub_authority_tag['sameAs'] = pub_authority['authority']
        soup.append(pub_authority_tag)
    return soup
            

def generate_tei_identifiers(data):
    soup = BeautifulSoup()
    for identifier in data['identifiers']:
        identifier_tag = soup.new_tag('idno')
        identifier_tag.string = identifier['text']
        identifier_tag['xml:id'] = f"identifier-{identifier['id']}"
        identifier_tag['type'] = identifier['type'].upper()
        soup.append(identifier_tag)
    return soup


def generate_tei_notes(data):
    soup = BeautifulSoup()
    for note in data['notes']:
        note_tag = soup.new_tag('note')
        note_tag.string = note['text']
        note_tag['xml:id'] = f"note-{note['id']}"
        soup.append(note_tag)
    return soup


def generate_tei_sources(data):
    soup = BeautifulSoup()
    for source in data['sources']:
        source_tag = soup.new_tag('bibl')
        source_tag.string = source['text']
        source_tag['xml:id'] = f"source-{source['id']}"
        soup.append(source_tag)
    return soup


def generate_tei_languages(data):
    soup = BeautifulSoup()
    lang_usage = soup.new_tag('langUsage')
    for language in data['languages']:
        language_tag = soup.new_tag('language')
        language_tag.string = language['text']
        language_tag['ident'] = language['ident']
        language_tag['usage'] = language['usage']
        lang_usage.append(language_tag)
    soup.append(lang_usage)
    return soup


def generate_tei_categories(data):
    soup = BeautifulSoup()
    text_class = soup.new_tag('textClass')
    for category in data['categories']:
        category_tag = soup.new_tag('catRef')
        category_tag['target'] = category['type']
        text_class.append(category_tag)
    soup.append(text_class)
    return soup


def generate_tei_extent(data):
    soup = BeautifulSoup()
    original_soup = BeautifulSoup(data['document']['content'], 'html.parser')
    original_text = original_soup.get_text()
    num_characters = len(original_text)
    words = re.findall(r'\w+', original_text)
    num_words = len(words)
    sentences = re.split(r'[.!?]', original_text)
    num_sentences = len([s for s in sentences if s.strip() != ''])


def generate_tei_header(data):
    # Create a BeautifulSoup object with a specified XML namespace
    soup = BeautifulSoup('', 'xml')

    # Create the <teiHeader> tag with the specified namespace
    tei_header = soup.new_tag('teiHeader', xmlns='http://www.tei-c.org/ns/1.0')

    # Create the child tags within <teiHeader>
    file_desc = soup.new_tag('fileDesc')
    title_stmt = soup.new_tag('titleStmt')
    publication_stmt = soup.new_tag('publicationStmt')
    source_desc = soup.new_tag('sourceDesc')
    note_stmt = soup.new_tag('noteStmt')
    encoding_desc = soup.new_tag('encodingDesc')
    profile_desc = soup.new_tag('profileDesc')


    titles = generate_tei_titles(data=data)
    title_stmt.append(titles)

    responsibilities = generate_tei_responsibilities(data=data)
    title_stmt.append(responsibilities)

    pub_authorities = generate_tei_pub_authorities(data=data)
    publication_stmt.append(pub_authorities)

    pub_place = soup.new_tag('pubPlace')
    pub_place.string = data['pubPlace']['name']
    pub_place['sameAs'] = data['pubPlace']['authority']
    publication_stmt.append(pub_place)

    pub_date = soup.new_tag('date')
    pub_date.string = str(data['pubDate']['date'])
    pub_date['when'] = data['pubDate']['date']
    publication_stmt.append(pub_date)

    identifiers = generate_tei_identifiers(data=data)
    publication_stmt.append(identifiers)

    availability = soup.new_tag('availability')
    availability['status'] = data['availability']['status']
    license = soup.new_tag('license')
    license.string = data['availability']['text']
    license['target'] = data['availability']['link']
    availability.append(license)
    publication_stmt.append(availability)

    notes = generate_tei_notes(data=data)
    note_stmt.append(notes)

    sources = generate_tei_sources(data=data)
    source_desc.append(sources)

    description = soup.new_tag('projectDesc')
    paragraph = soup.new_tag('p')
    paragraph.string = data['description']['text']
    description.append(paragraph)
    encoding_desc.append(description)

    creation = soup.new_tag('creation')
    creation_date = soup.new_tag('date')
    creation_date.string = str(data['creationDate']['date'])
    creation_date['when'] = data['creationDate']['date']
    creation.append(creation_date)
    creation_place = soup.new_tag('placeName')
    creation_place.string = data['creationPlace']['name']
    creation_place['sameAs'] = data['creationPlace']['authority']
    creation.append(creation_place)
    profile_desc.append(creation)

    languages = generate_tei_languages(data=data)
    profile_desc.append(languages)

    categories = generate_tei_categories(data=data)
    profile_desc.append(categories)

    # Append the child tags to their respective parents
    file_desc.append(title_stmt)
    file_desc.append(publication_stmt)
    file_desc.append(note_stmt)
    file_desc.append(source_desc)
    tei_header.append(file_desc)
    tei_header.append(encoding_desc)
    tei_header.append(profile_desc)

    # Append the <teiHeader> tag to the soup
    soup.append(tei_header)

    return soup.prettify()


def generate_tei_content(data):

    # Create a BeautifulSoup object and parse the HTML
    soup = BeautifulSoup(data['document']['content'], 'html.parser')

    # Split the content at <br> tags and create paragraphs
    new_content = []
    paragraph_counter = 1
    for string in soup.stripped_strings:
        paragraph = soup.new_tag('p')
        paragraph['xml:id'] = f"D{data['document']['id']}P{paragraph_counter}"
        paragraph['n'] = paragraph_counter
        paragraph.append(string)
        new_content.append(paragraph)
        paragraph_counter += 1

    # Replace the original content with the new paragraphs
    soup.clear()
    soup.extend(new_content)

    entity_spans = soup.find_all('span', class_='entity')

    for entity in entity_spans:
        if 'date' in entity['class']:
            try:
                new_tag = soup.new_tag('date')
                new_tag['when'] = entity['data-when']
                new_tag['from'] = entity['data-from']
                new_tag['to'] = entity['data-to']
                new_tag['notBefore'] = entity['data-notbefore']
                new_tag['notAfter'] = entity['data-notafter']
            except:
                None
        else:
            if 'person' in entity['class']:
                new_tag = soup.new_tag('persName')
            elif 'place' in entity['class']:
                new_tag = soup.new_tag('placeName')
            elif 'work' in entity['class']:
                new_tag = soup.new_tag('bibl')
            elif 'organization' in entity['class']:
                new_tag = soup.new_tag('orgName')
            try:
                new_tag['ref'] = entity['data-sameas']
                # manca entity['data-name']
            except:
                None
        try:
            new_tag.string = entity.get_text()
            new_tag['n'] = f"D{data['document']['id']}A{entity['data-link']}" # DA RIVEDERE se voglio usare xml:id
            new_tag['cert'] = entity['data-certainty']
            new_tag['evidence'] = entity['data-evidence']
        except:
            None
        entity.replace_with(new_tag)
                    
    return soup.prettify()