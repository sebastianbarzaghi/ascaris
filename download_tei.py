import re
import zipfile
import os
from bs4 import BeautifulSoup, Tag
from datetime import datetime
from models import Document
import requests


def read_template():
    xml_file_path = "templates/tei_template.xml"
    xml_content = ""
    try:
        with open(xml_file_path, 'r', encoding='utf-8') as file:
            xml_content = file.read()
            return xml_content
    except FileNotFoundError:
        print(f"File not found: {xml_file_path}")
    except Exception as e:
        print(f"An error occurred while reading the file: {e}")


def generate_tei(document):
    soup = BeautifulSoup(read_template(), 'xml')
    
    titleStmt = soup.find('titleStmt')
    for title in document['title']:
        tei_title = soup.new_tag('title')
        tei_title['xml:id'] = f'title-{title["id"]}'
        tei_title['xml:lang'] = title['language']
        tei_title.string = title['text']
        titleStmt.append(tei_title)
    for responsibility in document['responsibility']:
        if responsibility['role'] == 'author':
            tei_resp = soup.new_tag('author')
        elif responsibility['role'] == 'editor':
            tei_resp = soup.new_tag('editor')
        elif responsibility['role'] == 'founder':
            tei_resp = soup.new_tag('founder')
        elif responsibility['role'] == 'sponsor':
            tei_resp = soup.new_tag('sponsor')
        else:
            tei_resp = soup.new_tag('principal')
        tei_resp['xml:id'] = f'resp-{responsibility["id"]}'
        tei_resp['sameAs'] = responsibility['authority']
        tei_resp.string = f'{responsibility["surname"]}, {responsibility["name"]}'
        titleStmt.append(tei_resp)
    publicationStmt = soup.find('publicationStmt')
    for pubAuthority in document['pubAuthority']:
        if pubAuthority['role'] == 'publisher':
            tei_auth = soup.new_tag('publisher')
        elif pubAuthority['role'] == 'distributor':
            tei_auth = soup.new_tag('distributor')
        elif pubAuthority['role'] == 'authority':
            tei_auth = soup.new_tag('authority')
        tei_auth['xml:id'] = f'pubauth-{pubAuthority["id"]}'
        tei_auth['sameAs'] = pubAuthority['authority']
        tei_auth.string = pubAuthority['name']
        publicationStmt.append(tei_auth)
    for identifier in document['identifier']:
        tei_idno = soup.new_tag('idno')
        tei_idno['xml:id'] = f'ident-{identifier["id"]}'
        tei_idno['type'] = identifier['type']
        tei_idno.string = identifier['text']
        publicationStmt.append(tei_idno)
    for pubPlace in document['pubPlace']:
        tei_pubPlace = soup.new_tag('pubPlace')
        tei_pubPlace['xml:id'] = f'pubplace-{pubPlace["id"]}'
        tei_pubPlace['sameAs'] = pubPlace['authority']
        tei_pubPlace.string = pubPlace['name']
        publicationStmt.append(tei_pubPlace)
    '''for pubDate in document['pubDate']:
        tei_pubDate = soup.new_tag('date')
        tei_pubDate['xml:id'] = f'pubdate-{pubDate["id"]}'
        tei_pubDate['when'] = pubDate['date']
        tei_pubDate.string = pubDate['date']
        publicationStmt.append(pubDate)'''
    for license in document['license']:
        tei_availability = soup.new_tag('availability')
        tei_license = soup.new_tag('licence')
        tei_p = soup.new_tag('p')
        tei_license['xml:id'] = f'license-{license["id"]}'
        tei_license['target'] = license['link']
        tei_p.string = license['text']
        tei_license.append(tei_p)
        tei_availability.append(tei_license)
        publicationStmt.append(tei_availability)
    notesStmt = soup.find('notesStmt')
    for note in document['note']:
        tei_note = soup.new_tag('note')
        tei_note['xml:id'] = f'note-{note["id"]}'
        tei_note.string = note['text']
        notesStmt.append(tei_note)
    sourceDesc = soup.find('sourceDesc')
    for source in document['source']:
        tei_source = soup.new_tag('bibl')
        tei_source['xml:id'] = f'{source["id"]}'
        tei_source.string = source['text']
        sourceDesc.append(tei_source)
    '''creation = soup.find('creation')
    for creationDate in document['creationDate']:
        tei_creationDate = soup.new_tag('date')
        tei_creationDate['xml:id'] = f'creationdate-{creationDate["id"]}'
        tei_creationDate['when'] = creationDate['date']
        tei_creationDate.string = creationDate['date']'''
    textClass = soup.find('textClass')
    for category in document['category']:
        tei_catRef = soup.new_tag('catRef')
        tei_catRef['xml:id'] = f'category-{category["id"]}'
        tei_catRef['target'] = category['type']
        textClass.append(tei_catRef)
    '''profileDesc = soup.find('profileDesc')
    for abstract in document['abstract']:
        tei_abstract = soup.new_tag('abstract')
        tei_abstract['xml:id'] = f'abstract-{abstract["id"]}'
        tei_abstract.string = abstract['text']
        profileDesc.append(abstract)'''
    rdfData = soup.find('RDF')
    for entity in document['entity']:
        if entity['type'] == 'person':
            rdf_entity = soup.new_tag('foaf:Person')
            rdf_entity_label = soup.new_tag('foaf:name')
        elif entity['type'] == 'place':
            rdf_entity = soup.new_tag('schema:Place')
            rdf_entity_label = soup.new_tag('schema:name')
        elif entity['type'] == 'organization':
            rdf_entity = soup.new_tag('foaf:Organization')
            rdf_entity_label = soup.new_tag('foaf:name')
        elif entity['type'] == 'work':
            rdf_entity = soup.new_tag('fabio:Work')
            rdf_entity_label = soup.new_tag('dcterms:title')
        rdf_entity['rdf:about'] = f"#entity-{entity['id']}"
        rdf_entity_label.string = entity['label']
        rdf_entity_sameas = soup.new_tag('owl:sameAs')
        rdf_entity_sameas['rdf:resource'] = entity['authority']
        rdf_entity.append(rdf_entity_label)
        rdf_entity.append(rdf_entity_sameas)
        rdfData.append(rdf_entity)
    
    tei_text = soup.find('text')
    clean_content = document['content'].strip()
    split_content = clean_content.split('<br>')[:-1]
    joined_content = ''
    for i, content_chunk in enumerate(split_content):
        content_chunk = f'<p xml:id="paragraph-{i}" n="{i}">{content_chunk}</p>'
        joined_content += content_chunk
    content_soup = BeautifulSoup(joined_content, 'html.parser')
    references = content_soup.find_all('span', class_='reference')
    for reference in references:
        ref_tag = soup.new_tag('ref')
        ref_tag.string = reference.text
        for attr_name, attr_value in reference.attrs.items():
            if attr_name == 'id':
                ref_tag['xml:id'] = f'{attr_value}'
            elif attr_name == 'data-entity':
                ref_tag['target'] = f'#entity-{attr_value}'
        reference.replace_with(ref_tag)
    tei_text.append(content_soup)
    
    listAnnotation = soup.find('listAnnotation')
    for entity in document['entity']:
        for reference in entity['reference']:
            for annotation in reference['annotation']:
                tei_annotation = soup.new_tag('annotation')
                tei_annotation['xml:id'] = f'annotation-{annotation["id"]}'
                tei_annotation['xml:lang'] = annotation['language']
                tei_annotation['motivation'] = annotation['motivation']
                tei_annotation['target'] = f'#reference-{annotation["reference_id"]}'
                tei_annotation_note = soup.new_tag('note')
                tei_annotation_note.string = annotation['text']
                tei_annotation_license = soup.new_tag('license')
                tei_annotation_license['target'] = annotation['license']
                tei_annotation_revision = soup.new_tag('revisionDesc')
                tei_annotation_created = soup.new_tag('change')
                tei_annotation_modified = soup.new_tag('change')
                tei_annotation_created['when'] = annotation['created_at']
                tei_annotation_created['status'] = 'created'
                tei_annotation_modified['when'] = annotation['updated_at']
                tei_annotation_modified['status'] = 'modified'
                tei_annotation_revision.append(tei_annotation_created)
                tei_annotation_revision.append(tei_annotation_modified)
                tei_annotation.append(tei_annotation_revision)
                tei_annotation.append(tei_annotation_note)
                tei_annotation.append(tei_annotation_license)
                listAnnotation.append(tei_annotation)
    print(tei_text)
    extent = soup.find('extent')
    #characters -> tei_text
    #words -> tei_text
    #sentences -> tei_text
    #entities -> xenodata
    #references -> tei_text
    #annotations -> standoff
    return soup.prettify()


def generate_tei_mass():
    temp_dir = 'temp_tei_files'
    os.makedirs(temp_dir, exist_ok=True)
    all_documents = Document.query.all()
    try:
        for document in all_documents:
            tei_document = generate_tei(document)
            tei_filename = f"tei-{document['id']}.xml"
            tei_filepath = os.path.join(temp_dir, tei_filename)
            with open(tei_filepath, 'w', encoding='utf-8') as tei_file:
                tei_file.write(tei_document)
        zip_filename = 'tei_documents.zip'
        with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as tei_zip:
            for document in all_documents:
                tei_filename = f"{document['id']}.xml"
                tei_filepath = os.path.join(temp_dir, tei_filename)
                tei_zip.write(tei_filepath, os.path.basename(tei_filepath))
        for document in all_documents:
            tei_filename = f"{document['id']}.xml"
            tei_filepath = os.path.join(temp_dir, tei_filename)
            os.remove(tei_filepath)
        os.rmdir(temp_dir)
    except Exception as e:
        raise Exception(f"An error occurred: {e}")
    return zip_filename
