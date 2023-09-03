from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_migrate import Migrate
from bs4 import BeautifulSoup
from models import db, Document, Title, Resp, PubAuthority, PubPlace, PubDate, Identifier, Availability, Source, Note, Description, Abstract, CreationPlace, CreationDate, Language, Category


app = Flask(__name__, static_url_path='/static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test2.db'
app.secret_key = 'mysecretkey'
db.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def index():
    documents = Document.query.order_by(Document.updated_at.desc()).all()
    return render_template('index.html', documents=documents)

@app.route('/document/new', methods=['GET', 'POST'])
def new_document():
    if request.method == 'POST':
        title = request.form['docTitle']
        content = request.form['content']
        if not title or not content:
            flash('Please enter a title and content for your document.', 'error')
            return redirect(url_for('new_document'))
        document = Document(docTitle=title, content=content)
        db.session.add(document)
        db.session.commit()

        flash('Your document has been created successfully.', 'success')
        return redirect(url_for('index'))
    return render_template('new_document.html')

@app.route('/document/<int:id>/edit', methods=['GET', 'POST'])
def edit_document(id):
    document = Document.query.get_or_404(id)
    return render_template('edit_document.html', document=document)

# Flask route to save or update a document
@app.route("/save_document", methods=["POST"])
def save_document():
    data = request.get_json()
    document_id = data.get("document_id")
    title = data.get("docTitle")
    content = data.get("content")

    # Check if a document with the given ID already exists
    document = Document.query.filter_by(id=document_id).first()

    if document:
        # Update the existing document
        document.docTitle = title
        document.content = content
        document.updated_at = datetime.utcnow()
    else:
        # Create a new document
        new_document = Document(docTitle=title, content=content)
        db.session.add(new_document)

    db.session.commit()
    return jsonify({"message": "Document saved successfully!"})


# Flask route to fetch a document by its ID
@app.route("/get_document/<int:document_id>")
def get_document(document_id):
    document = Document.query.get(document_id)
    if document:
        return jsonify({"docTitle": document.docTitle, "content": document.content})
    else:
        return jsonify({"error": "Document not found"}), 404


@app.route('/save_metadata/<int:id>', methods=['POST'])
def save_metadata(id):
    document = Document.query.get_or_404(id)
    
    if request.method == 'POST':

        title_text = request.form.get('title-text')
        title_language = request.form.get('title-language')
        title_type = request.form.get('title-type')
        title_level = request.form.get('title-level')
        existing_title = Title.query.filter_by(document_id=document.id).first()
        if existing_title:
            existing_title.text = title_text
            existing_title.lang = title_language
            existing_title.type = title_type
            existing_title.level = title_level
        else:
            title = Title(document_id=document.id, 
                          text=title_text, 
                          lang=title_language,
                          type=title_type,
                          level=title_level)
            db.session.add(title)
        
        resp_surname = request.form.get('resp-surname')
        resp_name = request.form.get('resp-name')
        resp_authority = request.form.get('resp-authority')
        resp_role = request.form.get('resp-role')
        existing_resp = Resp.query.filter_by(document_id=document.id).first()
        if existing_resp:
            existing_resp.surname = resp_surname
            existing_resp.name = resp_name
            existing_resp.authority = resp_authority
            existing_resp.role = resp_role
        else:
            resp = Resp(document_id=document.id,
                        surname=resp_surname,
                        name=resp_name,
                        authority=resp_authority,
                        role=resp_role)
            db.session.add(resp)

        pubAuthority_name = request.form.get('pubAuthority-name')
        pubAuthority_authority = request.form.get('pubAuthority-authority')
        pubAuthority_role = request.form.get('pubAuthority-role')
        existing_pubAuthority = PubAuthority.query.filter_by(document_id=document.id).first()
        if existing_pubAuthority:
            existing_pubAuthority.name = pubAuthority_name
            existing_pubAuthority.authority = pubAuthority_authority
            existing_pubAuthority.role = pubAuthority_role
        else:
            pubAuthority = PubAuthority(document_id=document.id,
                        name=pubAuthority_name,
                        authority=pubAuthority_authority,
                        role=pubAuthority_role)
            db.session.add(pubAuthority)

        pubPlace_name = request.form.get('pubPlace-name')
        pubPlace_authority = request.form.get('pubPlace-authority')
        existing_pubPlace = PubPlace.query.filter_by(document_id=document.id).first()
        if existing_pubPlace:
            existing_pubPlace.name = pubPlace_name
            existing_pubPlace.authority = pubPlace_authority
        else:
            pubPlace = PubPlace(document_id=document.id,
                                name=pubPlace_name,
                                authority=pubPlace_authority)
            db.session.add(pubPlace)

        pubDate_date = datetime.strptime(request.form.get('pubDate-date'), '%Y-%m-%d').date()
        existing_pubDate = PubDate.query.filter_by(document_id=document.id).first()
        if existing_pubDate:
            existing_pubDate.date = pubDate_date
        else:
            pubDate = PubDate(document_id=document.id,
                              date=pubDate_date)
            db.session.add(pubDate)

        ident_text = request.form.get('identifier-text')
        ident_type = request.form.get('identifier-type')
        existing_identifier = Identifier.query.filter_by(document_id=document.id).first()
        if existing_identifier:
            existing_identifier.text = ident_text
            existing_identifier.type = ident_type
        else:
            ident = Identifier(document_id=document.id,
                               text=ident_text,
                               type=ident_type)
            db.session.add(ident)

        availability_text = request.form.get('availability-text')
        availability_link = request.form.get('availability-link')
        availability_status = request.form.get('availability-status')
        existing_availability = Availability.query.filter_by(document_id=document.id).first()
        if existing_availability:
            existing_availability.text = availability_text
            existing_availability.link = availability_link
            existing_availability.status = availability_status
        else:
            availability = Availability(document_id=document.id,
                                        text=availability_text,
                                        link=availability_link,
                                        status=availability_status)
            db.session.add(availability)

        source_text = request.form.get('source-text')
        existing_source = Source.query.filter_by(document_id=document.id).first()
        if existing_source:
            existing_source.text = source_text
        else:
            source = Source(document_id=document.id,
                            text=source_text)
            db.session.add(source)

        note_text = request.form.get('note-text')
        existing_note = Note.query.filter_by(document_id=document.id).first()
        if existing_note:
            existing_note.text = note_text
        else:
            note = Note(document_id=document.id,
                        text=note_text)
            db.session.add(note)

        description_text = request.form.get('description-text')
        existing_description = Description.query.filter_by(document_id=document.id).first()
        if existing_description:
            existing_description.text = description_text
        else:
            description = Description(document_id=document.id,
                                      text=description_text)
            db.session.add(description)
        
        abstract_text = request.form.get('abstract-text')
        existing_abstract = Abstract.query.filter_by(document_id=document.id).first()
        if existing_abstract:
            existing_abstract.text = abstract_text
        else:
            abstract = Abstract(document_id=document.id,
                                text=abstract_text)
            db.session.add(abstract)

        creationPlace_name = request.form.get('creationPlace-name')
        creationPlace_authority = request.form.get('creationPlace-authority')
        existing_creationPlace = CreationPlace.query.filter_by(document_id=document.id).first()
        if existing_creationPlace:
            existing_creationPlace.name = creationPlace_name
            existing_creationPlace.authority = creationPlace_authority
        else:
            creationPlace = CreationPlace(document_id=document.id,
                                name=creationPlace_name,
                                authority=creationPlace_authority)
            db.session.add(creationPlace)

        creationDate_date = datetime.strptime(request.form.get('creationDate-date'), '%Y-%m-%d').date()
        existing_creationDate = CreationDate.query.filter_by(document_id=document.id).first()
        if existing_creationDate:
            existing_creationDate.date = creationDate_date
        else:
            creationDate = CreationDate(document_id=document.id,
                              date=creationDate_date)
            db.session.add(creationDate)

        lang_text = request.form.get('language-text')
        lang_ident = request.form.get('language-ident')
        lang_usage = request.form.get('language-usage')
        existing_lang = Language.query.filter_by(document_id=document.id).first()
        if existing_lang:
            existing_lang.text = lang_text
            existing_lang.ident = lang_ident
            existing_lang.usage = lang_usage
        else:
            lang = Language(document_id=document.id,
                            text=lang_text,
                            ident=lang_ident,
                            usage=lang_usage)
            db.session.add(lang)

        category_type = request.form.get('category-type')
        existing_category = Category.query.filter_by(document_id=document.id).first()
        if existing_category:
            existing_category.type = category_type
        else:
            category = Category(document_id=document.id,
                                type=category_type)
            db.session.add(category)

        db.session.commit()

    return redirect(url_for('edit_document', id=document.id))


@app.route('/get_existing_data/<int:id>')
def get_existing_data(id):
    existing_data = {
        'title': [],
        'resp': [],
        'pubAuthority': [],
        'pubPlace': [],
        'pubDate': [],
        'ident': [],
        'availability': [],
        'source': [],
        'note': [],
        'desc': [],
        'abstract': [],
        'creationPlace': [],
        'creationDate': [],
        'lang': [],
        'category': [],
        # Add more field types as needed
    }

    existing_titles = Title.query.filter_by(document_id=id).all()
    for title in existing_titles:
        existing_data['title'].append({
            'text': title.text,
            'lang': title.lang,
            'type': title.type,
            'level': title.level
        })
    
    existing_resps = Resp.query.filter_by(document_id=id).all()
    for resp in existing_resps:
        existing_data['resp'].append({
            'surname': resp.surname,
            'name': resp.name,
            'authority': resp.authority,
            'role': resp.role
        })

    existing_pubAuthorities = PubAuthority.query.filter_by(document_id=id).all()
    for pubAuthority in existing_pubAuthorities:
        existing_data['pubAuthority'].append({
            'name': pubAuthority.name,
            'authority': pubAuthority.authority,
            'role': pubAuthority.role
        })
    
    existing_pubPlace = PubPlace.query.filter_by(document_id=id).all()
    for pubPlace in existing_pubPlace:
        existing_data['pubPlace'].append({
            'name': pubPlace.name,
            'authority': pubPlace.authority
        })
    
    existing_pubDate = PubDate.query.filter_by(document_id=id).all()
    for pubDate in existing_pubDate:
        existing_data['pubDate'].append({
            'date': pubDate.date
        })

    existing_identifiers = Identifier.query.filter_by(document_id=id).all()
    for ident in existing_identifiers:
        existing_data['ident'].append({
            'text': ident.text,
            'type': ident.type
        })
    
    existing_availability = Availability.query.filter_by(document_id=id).all()
    for availability in existing_availability:
        existing_data['availability'].append({
            'text': availability.text,
            'link': availability.link,
            'status': availability.status
        })

    existing_sources = Source.query.filter_by(document_id=id).all()
    for source in existing_sources:
        existing_data['source'].append({
            'text': source.text
        })

    existing_notes = Note.query.filter_by(document_id=id).all()
    for note in existing_notes:
        existing_data['note'].append({
            'text': note.text
        })
    
    existing_description = Description.query.filter_by(document_id=id).all()
    for desc in existing_description:
        existing_data['desc'].append({
            'text': desc.text
        })
    
    existing_abstract = Abstract.query.filter_by(document_id=id).all()
    for abstract in existing_abstract:
        existing_data['abstract'].append({
            'text': abstract.text
        })

    existing_creationPlace = CreationPlace.query.filter_by(document_id=id).all()
    for creationPlace in existing_creationPlace:
        existing_data['creationPlace'].append({
            'name': creationPlace.name,
            'authority': creationPlace.authority
        })
    
    existing_creationDate = CreationDate.query.filter_by(document_id=id).all()
    for creationDate in existing_creationDate:
        existing_data['creationDate'].append({
            'date': creationDate.date
        })
    
    existing_languages = Language.query.filter_by(document_id=id).all()
    for lang in existing_languages:
        existing_data['lang'].append({
            'text': lang.text,
            'ident': lang.ident,
            'usage': lang.usage
        })
    
    existing_categories = Category.query.filter_by(document_id=id).all()
    for cat in existing_categories:
        existing_data['category'].append({
            'type': cat.type
        })

    return jsonify(existing_data)


@app.route('/docta')
def serve_docta():
    rdf_file_path = 'instance/docta.ttl'

    with open(rdf_file_path, 'rb') as f:
        rdf_content = f.read()

    response = app.response_class(
        response=rdf_content,
        status=200,
        mimetype='application/turtle'
    )

    return response


if __name__ == '__main__':
    app.run(debug=True)

