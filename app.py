from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_migrate import Migrate
from bs4 import BeautifulSoup
from models import db, Document, Title, Resp, PubPlace, Identifier, Description


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

        #pubauthority --> da unire surname e name in singolo campo

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

        #pubdate --> da modificare il campo name

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

        # availability --> da cambiare info in text, e forse togliere status

        description_text = request.form.get('description-text')
        existing_description = Description.query.filter_by(document_id=document.id).first()
        if existing_description:
            existing_description.text = description_text
        else:
            description = Description(document_id=document.id,
                                      text=description_text)
            db.session.add(description)

        db.session.commit()

    return redirect(url_for('edit_document', id=document.id))


@app.route('/get_existing_data/<int:id>/<field_type>')
def get_existing_data(id, field_type):
    existing_data = {
        'title': [],
        'resp': [],
        'pubPlace': [],
        'ident': [],
        'desc': [],
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
    
    existing_pubPlace = PubPlace.query.filter_by(document_id=id).all()
    for pubPlace in existing_pubPlace:
        existing_data['pubPlace'].append({
            'name': pubPlace.name,
            'authority': pubPlace.authority
        })

    existing_identifiers = Identifier.query.filter_by(document_id=id).all()
    for ident in existing_identifiers:
        existing_data['ident'].append({
            'text': ident.text,
            'type': ident.type
        })
    
    existing_description = Description.query.filter_by(document_id=id).all()
    for desc in existing_description:
        existing_data['desc'].append({
            'text': desc.text
        })

    return jsonify(existing_data)


if __name__ == '__main__':
    app.run(debug=True)

