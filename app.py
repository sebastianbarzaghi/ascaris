from flask import Response, render_template, request, flash, jsonify, redirect, send_from_directory, url_for
from download_tei import generate_tei, generate_tei_mass
from manipulate_documents import allowed_file, read_docx, read_pdf, read_txt
from config import app, connex_app
import secrets, os, time
import annotation as annotation_api
import reference as reference_api
import entity as entity_api
import title as title_api
import responsibility as responsibility_api
import pubAuthority as pubAuthority_api
import source as source_api
import pubDate as pubDate_api
import pubPlace as pubPlace_api
import note as note_api
import license as license_api
import identifier as identifier_api
import creationDate as creationDate_api
import abstract as abstract_api
import document as document_api
import category as category_api
from datetime import datetime
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'static\images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


connex_app.add_api("swagger.yml")
secret_key = secrets.token_hex(24)
app.secret_key = secret_key
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def index():
    documents = document_api.read_all()
    return render_template('index.html', documents=documents)

@app.route('/document/<int:id>')
def get_document(id):
    return document_api.read_one(id)

@app.route('/document/<int:id>/edit', methods=['GET', 'POST'])
def edit_document(id):
    document = document_api.read_one(id)

    entities = entity_api.read_all(id)

    concepts = category_api.get_skos_concepts()
    existing_titles = document['title']
    existing_responsibilities = document['responsibility']
    existing_pubAuthorities = document['pubAuthority']
    existing_pubPlaces = document['pubPlace']
    existing_pubDates = document['pubDate']
    existing_identifiers = document['identifier']
    existing_licenses = document['license']
    existing_sources = document['source']
    existing_notes = document['note']
    existing_abstracts = document['abstract']
    existing_creationDates = document['creationDate']
    existing_categories = document['category']
    if existing_pubDates:
        for existing_pubDate in existing_pubDates:
            if existing_pubDate.get('date'):
                existing_pubDate['date'] = datetime.strptime(existing_pubDate['date'], '%Y-%m-%dT%H:%M:%S').strftime('%Y-%m-%d')
    if existing_creationDates:
        for existing_creationDate in existing_creationDates:
            if existing_creationDate.get('date'):
                existing_creationDate['date'] = datetime.strptime(existing_creationDate['date'], '%Y-%m-%dT%H:%M:%S').strftime('%Y-%m-%d')

    return render_template('edit_document.html', 
                           document=document,
                           entities=entities,
                           existing_titles=existing_titles,
                           existing_responsibilities=existing_responsibilities,
                           existing_pubAuthorities=existing_pubAuthorities,
                           existing_pubPlaces=existing_pubPlaces,
                           existing_pubDates=existing_pubDates,
                           existing_identifiers=existing_identifiers,
                           existing_licenses=existing_licenses,
                           existing_sources=existing_sources,
                           existing_notes=existing_notes,
                           existing_abstracts=existing_abstracts,
                           existing_creationDates=existing_creationDates,
                           existing_categories=existing_categories,
                           concepts=concepts,
                           images=get_uploaded_images())


@app.route('/document/new', methods=['GET', 'POST'])
def new_document():
    if request.method == 'POST':
        title = request.form['docTitle']
        content = request.form['content']
        payload = {
            'docTitle': title,
            'content': content
        }
        document_api.create(payload)
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
                payload = {
                    'docTitle': title,
                    'content': content
                }
                document_api.create(payload)
    return render_template('new_document.html')


@app.route("/save_document", methods=["POST"])
def save_document():
    data = request.get_json()
    document_id = data.get("id")
    return document_api.update(document_id, {'docTitle': data.get('docTitle'), 'content': data.get('content')})


@app.route('/metadata/<int:id>', methods=['PUT'])
def save_metadata(id):
    metadata = [
        'title',
        'responsibility',
        'pubAuthority',
        'source',
        'pubPlace',
        'pubDate',
        'note',
        'license',
        'identifier',
        'creationDate',
        'category',
        'abstract'
    ]
    try:
        data = request.get_json()
        for field_group in metadata:
            if data[field_group]:
                for field in data[field_group]:
                    field_id = field['id']
                    del field['id']
                    if field_group == 'title':
                        title_api.update(field_id, field)
                    elif field_group == 'responsibility':
                        responsibility_api.update(field_id, field)
                    elif field_group == 'pubAuthority':
                        pubAuthority_api.update(field_id, field)
                    elif field_group == 'source':
                        source_api.update(field_id, field)
                    elif field_group == 'pubPlace':
                        pubPlace_api.update(field_id, field)
                    elif field_group == 'pubDate':
                        pubDate_api.update(field_id, field)
                    elif field_group == 'note':
                        note_api.update(field_id, field)
                    elif field_group == 'license':
                        license_api.update(field_id, field)
                    elif field_group == 'identifier':
                        identifier_api.update(field_id, field)
                    elif field_group == 'creationDate':
                        creationDate_api.update(field_id, field)
                    elif field_group == 'category':
                        category_api.update(field_id, field)
                    elif field_group == 'abstract':
                        abstract_api.update(field_id, field)
                
        return jsonify(data), 200  # Return a response to the client
    except Exception as e:
        return str(e), 400  # Handle errors and return an appropriate response


@app.route('/annotation', methods=['POST'])
def create_annotation():
    data = request.json
    return annotation_api.create(data)

@app.route('/annotation/<int:annotation_id>', methods=['GET'])
def read_annotation(annotation_id):
    return annotation_api.read_one(annotation_id)

@app.route('/annotation/<int:annotation_id>', methods=['PUT'])
def update_annotation(annotation_id):
    data = request.get_json()
    return annotation_api.update(annotation_id, data)

@app.route('/annotation/<int:annotation_id>', methods=['DELETE'])
def delete_annotation(annotation_id):
    return annotation_api.delete(annotation_id)


@app.route('/reference', methods=['POST'])
def create_reference():
    data = request.json
    return reference_api.create(data)

@app.route('/reference/<int:reference_id>', methods=['GET'])
def read_reference(reference_id):
    return reference_api.read_one(reference_id)

@app.route('/reference/<int:reference_id>', methods=['PUT'])
def update_reference(reference_id, reference):
    return reference_api.update(reference_id, reference)

@app.route('/reference/<int:reference_id>', methods=['DELETE'])
def delete_reference(reference_id):
    return reference_api.delete(reference_id)


@app.route('/entity', methods=['POST'])
def create_entity():
    data = request.json
    return entity_api.create(data)

@app.route('/entity/<int:entity_id>', methods=['GET'])
def read_entity(entity_id):
    return entity_api.read_one(entity_id)

@app.route('/entity/<int:entity_id>', methods=['PUT'])
def update_entity(entity_id):
    data = request.get_json()
    return entity_api.update(entity_id, data)

@app.route('/entity/<int:entity_id>', methods=['DELETE'])
def delete_entity(entity_id):
    return entity_api.delete(entity_id)


@app.route('/title', methods=['POST'])
def create_title():
    data = request.json
    return title_api.create(data)

@app.route('/title/<int:title_id>', methods=['PUT'])
def update_document_title(title_id, title):
    return title_api.update(title_id, title)

@app.route('/title/<int:title_id>', methods=['DELETE'])
def delete_document_title(title_id):
    return title_api.delete(title_id)


@app.route('/responsibility', methods=['POST'])
def create_responsibility():
    data = request.json
    return responsibility_api.create(data)

@app.route('/responsibility/<int:responsibility_id>', methods=['PUT'])
def update_document_responsibility(responsibility_id, responsibility):
    return responsibility_api.update(responsibility_id, responsibility)

@app.route('/responsibility/<int:responsibility_id>', methods=['DELETE'])
def delete_document_responsibility(responsibility_id):
    return responsibility_api.delete(responsibility_id)


@app.route('/pubAuthority', methods=['POST'])
def create_pubAuthority():
    data = request.json
    return pubAuthority_api.create(data)

@app.route('/pubAuthority/<int:pubAuthority_id>', methods=['PUT'])
def update_document_pubAuthority(pubAuthority_id, pubAuthority):
    return pubAuthority_api.update(pubAuthority_id, pubAuthority)

@app.route('/pubAuthority/<int:pubAuthority_id>', methods=['DELETE'])
def delete_document_pubAuthority(pubAuthority_id):
    return pubAuthority_api.delete(pubAuthority_id)


@app.route('/source', methods=['POST'])
def create_source():
    data = request.json
    return source_api.create(data)

@app.route('/source/<int:source_id>', methods=['PUT'])
def update_document_source(source_id, source):
    return source_api.update(source_id, source)

@app.route('/source/<int:source_id>', methods=['DELETE'])
def delete_document_source(source_id):
    return source_api.delete(source_id)


@app.route('/license', methods=['POST'])
def create_license():
    data = request.json
    return license_api.create(data)

@app.route('/license/<int:license_id>', methods=['PUT'])
def update_document_license(license_id, license):
    return license_api.update(license_id, license)

@app.route('/license/<int:license_id>', methods=['DELETE'])
def delete_document_license(license_id):
    return license_api.delete(license_id)


@app.route('/pubPlace', methods=['POST'])
def create_pubPlace():
    data = request.json
    return pubPlace_api.create(data)

@app.route('/pubPlace/<int:pubPlace_id>', methods=['PUT'])
def update_document_pubPlace(pubPlace_id, pubPlace):
    return pubPlace_api.update(pubPlace_id, pubPlace)

@app.route('/pubPlace/<int:pubPlace_id>', methods=['DELETE'])
def delete_document_pubPlace(pubPlace_id):
    return pubPlace_api.delete(pubPlace_id)


@app.route('/note', methods=['POST'])
def create_note():
    data = request.json
    return note_api.create(data)

@app.route('/note/<int:note_id>', methods=['PUT'])
def update_document_note(note_id, note):
    return note_api.update(note_id, note)

@app.route('/note/<int:note_id>', methods=['DELETE'])
def delete_document_note(note_id):
    return note_api.delete(note_id)


@app.route('/pubDate', methods=['POST'])
def create_pubDate():
    data = request.json
    return pubDate_api.create(data)

@app.route('/pubDate/<int:pubDate_id>', methods=['PUT'])
def update_document_pubDate(pubDate_id, pubDate):
    return pubDate_api.update(pubDate_id, pubDate)

@app.route('/pubDate/<int:pubDate_id>', methods=['DELETE'])
def delete_document_pubDate(pubDate_id):
    return pubDate_api.delete(pubDate_id)


@app.route('/identifier', methods=['POST'])
def create_identifier():
    data = request.json
    return identifier_api.create(data)

@app.route('/identifier/<int:identifier_id>', methods=['PUT'])
def update_document_identifier(identifier_id, identifier):
    return identifier_api.update(identifier_id, identifier)

@app.route('/identifier/<int:identifier_id>', methods=['DELETE'])
def delete_document_identifier(identifier_id):
    return identifier_api.delete(identifier_id)


@app.route('/creationDate', methods=['POST'])
def create_creationDate():
    data = request.json
    return creationDate_api.create(data)

@app.route('/creationDate/<int:creationDate_id>', methods=['PUT'])
def update_document_creationDate(creationDate_id, creationDate):
    return creationDate_api.update(creationDate_id, creationDate)

@app.route('/creationDate/<int:creationDate_id>', methods=['DELETE'])
def delete_document_creationDate(creationDate_id):
    return creationDate_api.delete(creationDate_id)


@app.route('/category', methods=['POST'])
def create_category():
    data = request.json
    return category_api.create(data)

@app.route('/category/<int:category_id>', methods=['PUT'])
def update_document_category(category_id, category):
    return category_api.update(category_id, category)

@app.route('/category/<int:category_id>', methods=['DELETE'])
def delete_document_category(category_id):
    return category_api.delete(category_id)


@app.route('/abstract', methods=['POST'])
def create_abstract():
    data = request.json
    return abstract_api.create(data)

@app.route('/abstract/<int:abstract_id>', methods=['PUT'])
def update_document_abstract(abstract_id, abstract):
    return abstract_api.update(abstract_id, abstract)

@app.route('/abstract/<int:abstract_id>', methods=['DELETE'])
def delete_document_abstract(abstract_id):
    return abstract_api.delete(abstract_id)


@app.route('/download_tei/<int:document_id>')
def download_tei(document_id):
    document = get_document(document_id)
    tei_document = generate_tei(document)
    response = Response(tei_document, content_type='application/xml')
    response.headers['Content-Disposition'] = f'attachment; filename=document_{document_id}.xml'
    return response


@app.route('/download_tei/all_documents')
def download_all_documents_route():
    try:
        zip_filename = generate_tei_mass()
        if not os.path.isfile(zip_filename):
            return "ZIP file not found", 404
        with open(zip_filename, 'rb') as zip_file:
            zip_data = zip_file.read()
        response = Response(zip_data)
        response.headers['Content-Type'] = 'application/zip'
        response.headers['Content-Disposition'] = 'attachment; filename=tei_documents.zip'
        return response
    except Exception as e:
        return str(e), 500


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_uploaded_images():
    image_files = [f for f in os.listdir(app.config['UPLOAD_FOLDER']) if f.endswith(('.jpg', '.jpeg', '.png'))]
    images = []
    for image in image_files:
        image_path = os.path.join(UPLOAD_FOLDER, image)
        created = os.path.getctime(image_path)
        size = os.path.getsize(image_path)
        images.append({
            'filename': image,
            'created': time.ctime(created),
            'size': f'{size} bytes'
        })
    return images

@app.route('/uploads/<filename>')
def uploaded_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/image/new', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            img = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(img)
            return render_template('new_image.html', images=get_uploaded_images())
    return render_template('new_image.html', images=get_uploaded_images())

@app.route('/document/<int:id>/associate_images', methods=['POST'])
def associate_images(id):
    document = document_api.read_one(id)
    
    selected_images = request.form.getlist('selected_images')
    
    # Append selected images to the document's image attribute
    if not document.get('image'):
        document['image'] = ''
    
    document['image'].extend(selected_images)
    
    # Update the document in your data store
    document_api.update(document)
    
    return redirect(url_for('edit_document', id=id))


@app.route('/delete_image/<filename>', methods=['POST'])
def delete_image(filename):
    image_path = os.path.join(UPLOAD_FOLDER, filename)

    if os.path.exists(image_path):
        os.remove(image_path)
        return "Image deleted successfully"
    else:
        return "Image not found", 404

'''
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
'''

if __name__ == '__main__':
    app.run(debug=True)