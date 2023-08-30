from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_migrate import Migrate
from bs4 import BeautifulSoup
from models import db, Document, Title

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
        existing_title = Title.query.filter_by(document_id=document.id).first()
        if existing_title:
            existing_title.text = title_text
        else:
            title = Title(document_id=document.id, text=title_text)
            db.session.add(title)
        
        db.session.commit()

    return redirect(url_for('edit_document', id=document.id))


@app.route('/get_existing_data/<int:id>/<field_type>')
def get_existing_data(id, field_type):
    existing_data = []
    print(field_type)
    if field_type == 'title':
        existing_data = [title.text for title in Title.query.filter_by(document_id=id).all()]
        print(existing_data)
    return jsonify(existing_data)


if __name__ == '__main__':
    app.run(debug=True)

