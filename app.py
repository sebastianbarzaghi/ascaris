from flask import Flask, Response, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import Document
#from download_tei import generate_tei_header, generate_tei_content, download_all_documents_as_tei_zip
#from manipulate_data import get_data, update_or_add_data
from manipulate_documents import allowed_file, read_docx, read_pdf, read_txt
from config import app, connex_app
import requests
import secrets
import title


connex_app.add_api("swagger.yml")
secret_key = secrets.token_hex(24)
app.secret_key = secret_key


@app.route('/')
def index():
    documents = Document.query.order_by(Document.updated_at.desc()).all()
    return render_template('index.html', documents=documents)


@app.route('/document/<int:id>/edit', methods=['GET', 'POST'])
def edit_document(id):
    document = Document.query.get_or_404(id)
    return render_template('edit_document.html', document=document)


@app.route('/document/new', methods=['GET', 'POST'])
def new_document():
    if request.method == 'POST':
        title = request.form['docTitle']
        content = request.form['content']
        if not title or not content:
            flash('Please enter a title and content for your document.', 'error')
            return redirect(url_for('new_document'))
        api_url = 'http://localhost:5000/api/v1/document'
        payload = {
            'docTitle': title,
            'content': content
        }
        response = requests.post(api_url, json=payload)
        # Check if the API request was successful
        if response.status_code == 201:
            flash('Your document has been created successfully.', 'success')
            return redirect(url_for('index'))
        else:
            flash('Error creating the document. Please try again later.', 'error')
    return render_template('new_document.html')


@app.route('/document/upload', methods=['GET', 'POST'])
def upload_document():
    if request.method == 'POST':
        title = request.form['docTitle']
        uploaded_file = request.files['uploaded_file']
        if not title:
            flash('Please enter a title for your document.', 'error')
        elif not uploaded_file:
            flash('Please select a file to upload.', 'error')
        elif not allowed_file(uploaded_file.filename):
            flash('Invalid file format. Please upload a supported file type.', 'error')
        else:
            file_extension = uploaded_file.filename.rsplit('.', 1)[1].lower()
            if file_extension == 'docx':
                content = read_docx(uploaded_file)
            elif file_extension == 'pdf':
                content = read_pdf(uploaded_file)
            elif file_extension == 'txt':
                content = read_txt(uploaded_file)
            else:
                content = None
            if content:
                api_url = 'http://localhost:5000/api/v1/document'
                payload = {
                    'docTitle': title,
                    'content': content
                }
                response = requests.post(api_url, json=payload)
                if response.status_code == 201:
                    flash('Your document has been created successfully.', 'success')
                    return redirect(url_for('index'))
                else:
                    flash('Error creating the document. Please try again later.', 'error')
    return render_template('new_document.html')


@app.route('/title/<int:title_id>', methods=['PUT'])
def update_document_title(title_id, title):
    return title.update(title_id, title)

@app.route('/title/<int:title_id>', methods=['DELETE'])
def delete_document_title(title_id, title):
    return title.delete(title_id)

@app.route('/save_metadata/<int:id>', methods=['POST'])
def save_metadata(id):
    return id
'''
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
        update_or_add_data(['title-text', 'title-language'], Title, document.id)
        update_or_add_data(['responsibility-surname', 'responsibility-name', 'responsibility-authority', 'responsibility-role'], Responsibility, document.id)
        update_or_add_data(['pubAuthority-name', 'pubAuthority-authority', 'pubAuthority-role'], PubAuthority, document.id)
        update_or_add_data(['identifier-text', 'identifier-type'], Identifier, document.id)
        update_or_add_data(['note-text'], Note, document.id)
        update_or_add_data(['category-type'], Category, document.id)
        update_or_add_data(['source-text'], Source, document.id)
        update_or_add_data(['pubPlace-name', 'pubPlace-authority'], PubPlace, document.id)
        update_or_add_data(['pubDate-date'], PubDate, document.id)
        update_or_add_data(['license-text', 'license-link'], License, document.id)
        update_or_add_data(['abstract-text'], Abstract, document.id)
        update_or_add_data(['creationDate-date'], CreationDate, document.id)
        db.session.commit()
    return redirect(url_for('edit_document', id=document.id))
        

@app.route('/get_existing_data/<int:id>')
def get_existing_data(id):
    existing_data = get_data(id)
    return jsonify(existing_data)


@app.route('/delete/<model_name>/<int:record_id>', methods=['DELETE'])
def delete_record(model_name, record_id):
    try:
        # Get the SQLAlchemy model class based on the provided model_name
        model_class = globals().get(model_name)
        if not model_class:
            return jsonify({'message': 'Model not found'}), 404
        # Retrieve the record by its ID
        record = model_class.query.get(record_id)
        if record:
            # Delete the record from the database
            db.session.delete(record)
            db.session.commit()
            return jsonify({'message': f'{model_name} deleted successfully'}), 200
        else:
            return jsonify({'message': f'{model_name} not found'}), 404
    except Exception as e:
        return jsonify({'message': 'An error occurred'}), 500


@app.route('/download_tei/<int:document_id>')
def download_tei(document_id):
    data = get_data(document_id=document_id)
    tei_header = generate_tei_header(data=data)
    tei_content = generate_tei_content(data=data)
    # Create the complete TEI document
    tei_template = f"""
    <TEI xmlns="http://www.tei-c.org/ns/1.0">
      {tei_header}
      {tei_content}
    </TEI>
    """
    # Return the TEI document as a downloadable file
    response = Response(tei_template, content_type='application/xml')
    response.headers['Content-Disposition'] = f'attachment; filename=document_{document_id}.xml'
    return response


@app.route('/download_tei/all_documents')
def download_all_documents_route():
    try:
        # Call the download function from download.py
        zip_filename = download_all_documents_as_tei_zip()
        # Check if the file exists
        if not os.path.isfile(zip_filename):
            return "ZIP file not found", 404
        # Open the ZIP file in binary read mode
        with open(zip_filename, 'rb') as zip_file:
            zip_data = zip_file.read()
        # Set the appropriate headers for downloading a ZIP file
        response = Response(zip_data)
        response.headers['Content-Type'] = 'application/zip'
        response.headers['Content-Disposition'] = 'attachment; filename=tei_documents.zip'
        return response
    except Exception as e:
        return str(e), 500

'''
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