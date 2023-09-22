import re
import zipfile
import os
from bs4 import BeautifulSoup, Tag
from datetime import datetime
from models import Document
from manipulate_data import get_data


def generate_tei_titles(data):
    soup = BeautifulSoup()
    for title in data['titles']:
        title_tag = soup.new_tag('title')
        title_tag.string = title['text']
        title_tag['xml:id'] = f"title-{title['id']}"
        title_tag['lang'] = title['language']
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
    characters_measure = soup.new_tag('measure', unit='characters', quantity=num_characters)
    characters_measure.string = str(num_characters)
    soup.append(characters_measure)
    words_measure = soup.new_tag('measure', unit='words', quantity=num_words)
    words_measure.string = str(num_words)
    soup.append(words_measure)
    sentences_measure = soup.new_tag('measure', unit='sentences', quantity=num_sentences)
    sentences_measure.string = str(num_sentences)
    soup.append(sentences_measure)
    return soup


def generate_tei_app_info():
    soup = BeautifulSoup()
    app_info = soup.new_tag('appInfo')
    application = soup.new_tag('application', version='0.1.0', ident='AscarisEditor', when=datetime.now().date())
    label = soup.new_tag('label')
    label.string = 'Ascaris Editor'
    application.append(label)
    app_info.append(application)
    soup.append(app_info)
    return soup


def generate_tei_header(data):
    # Create a BeautifulSoup object with a specified XML namespace
    soup = BeautifulSoup()

    # Create the <teiHeader> tag with the specified namespace
    tei_header = soup.new_tag('teiHeader', xmlns='http://www.tei-c.org/ns/1.0')

    # Create the child tags within <teiHeader>
    file_desc = soup.new_tag('fileDesc')
    title_stmt = soup.new_tag('titleStmt')
    extent = soup.new_tag('extent')
    publication_stmt = soup.new_tag('publicationStmt')
    source_desc = soup.new_tag('sourceDesc')
    note_stmt = soup.new_tag('noteStmt')
    encoding_desc = soup.new_tag('encodingDesc')
    profile_desc = soup.new_tag('profileDesc')

    if 'titles' in data:
        titles = generate_tei_titles(data=data)
        title_stmt.append(titles)

    if 'responsibilities' in data:
        responsibilities = generate_tei_responsibilities(data=data)
        title_stmt.append(responsibilities)

    if 'document' in data:
        measures = generate_tei_extent(data=data)
        extent.append(measures)
        
        app_info = generate_tei_app_info()
        encoding_desc.append(app_info)
    
    if 'pubAuthorities' in data:
        pub_authorities = generate_tei_pub_authorities(data=data)
        publication_stmt.append(pub_authorities)

    if 'pubPlace' in data:
        pub_place = soup.new_tag('pubPlace')
        pub_place.string = data['pubPlace']['name']
        pub_place['sameAs'] = data['pubPlace']['authority']
        publication_stmt.append(pub_place)

    if 'pubDate' in data:
        pub_date = soup.new_tag('date')
        pub_date.string = str(data['pubDate']['date'])
        pub_date['when'] = data['pubDate']['date']
        publication_stmt.append(pub_date)

    if 'identifiers' in data:
        identifiers = generate_tei_identifiers(data=data)
        publication_stmt.append(identifiers)

    if 'license' in data:
        availability = soup.new_tag('availability')
        license = soup.new_tag('license')
        license.string = data['license']['text']
        license['target'] = data['license']['link']
        availability.append(license)
        publication_stmt.append(availability)

    if 'notes' in data:
        notes = generate_tei_notes(data=data)
        note_stmt.append(notes)

    if 'sources' in data:
        sources = generate_tei_sources(data=data)
        source_desc.append(sources)

    if 'description' in data:
        description = soup.new_tag('projectDesc')
        paragraph = soup.new_tag('p')
        paragraph.string = data['description']['text']
        description.append(paragraph)
        encoding_desc.append(description)

    if 'creationDate' in data:
        creation = soup.new_tag('creation')
        creation_date = soup.new_tag('date')
        creation_date.string = str(data['creationDate']['date'])
        creation_date['when'] = data['creationDate']['date']
        creation.append(creation_date)
        profile_desc.append(creation)

    if 'languages' in data:
        languages = generate_tei_languages(data=data)
        profile_desc.append(languages)

    if 'categories' in data:
        categories = generate_tei_categories(data=data)
        profile_desc.append(categories)

    # Append the child tags to their respective parents
    file_desc.append(title_stmt)
    file_desc.append(extent)
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

    paragraphs = []
    current_paragraph = []

    for element in soup.descendants:
        if element.name == 'br':
            if current_paragraph:
                paragraphs.append(current_paragraph)
            current_paragraph = []
        elif element.name == 'span' and 'entity' in element.get('class', []):
            current_paragraph.append(element)
        elif element.string:
            current_paragraph.append(element.string.strip())

    if current_paragraph:
        paragraphs.append(current_paragraph)

    # Create a new TEI document
    tei_soup = BeautifulSoup()
    tei_text = tei_soup.new_tag('text')
    tei_soup.append(tei_text)

    # Create paragraphs and reinsert marked-up entities
    paragraph_counter = 1
    for paragraph_content in paragraphs:
        paragraph = tei_soup.new_tag('p')
        paragraph['xml:id'] = f"D{data['document']['id']}P{paragraph_counter}"
        paragraph['n'] = paragraph_counter
        in_span = False  # Flag to track if we are inside a <span> tag
        for item in paragraph_content:
            if isinstance(item, str) and not in_span:
                paragraph.append(item)
            elif isinstance(item, Tag) and item.name == 'span':
                paragraph.append(item)
                if item.name == 'span':
                    in_span = True
            else:
                in_span = False
        tei_text.append(paragraph)
        paragraph_counter += 1

    entity_spans = tei_soup.find_all('span', class_='entity')
    if entity_spans:
        for entity in entity_spans:
            if 'date' in entity['class']:
                new_tag = soup.new_tag('date')
                if entity.has_attr('data-when'):
                    new_tag['when'] = entity['data-when']
                if entity.has_attr('data-from'):
                    new_tag['from'] = entity['data-from']
                if entity.has_attr('data-to'):
                    new_tag['to'] = entity['data-to']
                if entity.has_attr('data-notBefore'):
                    new_tag['notBefore'] = entity['data-notbefore']
                if entity.has_attr('data-notAfter'):
                    new_tag['notAfter'] = entity['data-notafter']
            else:
                if 'person' in entity['class']:
                    new_tag = soup.new_tag('persName')
                elif 'place' in entity['class']:
                    new_tag = soup.new_tag('placeName')
                elif 'work' in entity['class']:
                    new_tag = soup.new_tag('bibl')
                elif 'organization' in entity['class']:
                    new_tag = soup.new_tag('orgName')

                if 'data-sameas' in entity:
                    new_tag['ref'] = entity['data-sameas']
                
            new_tag.string = entity.get_text()
            new_tag['n'] = f"D{data['document']['id']}A{entity['data-link']}" # DA RIVEDERE se voglio usare xml:id
            if entity.has_attr('data-certainty'):
                new_tag['cert'] = entity['data-certainty']
            if entity.has_attr('data-evidence'):
                new_tag['evidence'] = entity['data-evidence']
            
            entity.replace_with(new_tag)

    tei_content = tei_soup.prettify()
    return tei_content


def download_all_documents_as_tei_zip():
    # Create a temporary directory to store TEI XML files
    temp_dir = 'temp_tei_files'
    os.makedirs(temp_dir, exist_ok=True)

    # Retrieve all documents from your database
    all_documents = Document.query.all()

    # Loop through each document and generate TEI XML
    try:
        for document in all_documents:
            data = get_data(document.id)
            tei_header = generate_tei_header(data=data)
            tei_content = generate_tei_content(data=data)
            tei_template = f"""
                <TEI xmlns="http://www.tei-c.org/ns/1.0">
                {tei_header}
                {tei_content}
                </TEI>
                """
            tei_filename = f"{document.id}.xml"
            tei_filepath = os.path.join(temp_dir, tei_filename)

            # Write TEI XML content to a file
            with open(tei_filepath, 'w', encoding='utf-8') as tei_file:
                tei_file.write(tei_template)
        # Create a zip file to store all TEI XML files
        zip_filename = 'tei_documents.zip'
        with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as tei_zip:
            # Add each TEI XML file to the zip archive
            for document in all_documents:
                tei_filename = f"{document.id}.xml"
                tei_filepath = os.path.join(temp_dir, tei_filename)
                tei_zip.write(tei_filepath, os.path.basename(tei_filepath))

        # Clean up the temporary directory
        for document in all_documents:
            tei_filename = f"{document.id}.xml"
            tei_filepath = os.path.join(temp_dir, tei_filename)
            os.remove(tei_filepath)
        os.rmdir(temp_dir)
    except Exception as e:
        raise Exception(f"An error occurred: {e}")

    # Return the path to the generated zip file
    return zip_filename