from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_migrate import Migrate
from bs4 import BeautifulSoup

app = Flask(__name__, static_url_path='/static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.secret_key = 'mysecretkey'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Document {self.id}>"

@app.route('/')
def index():
    documents = Document.query.order_by(Document.updated_at.desc()).all()
    return render_template('index.html', documents=documents)

@app.route('/document/new', methods=['GET', 'POST'])
def new_document():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        if not title or not content:
            flash('Please enter a title and content for your document.', 'error')
            return redirect(url_for('new_document'))
        document = Document(title=title, content=content)
        db.session.add(document)
        db.session.commit()
        flash('Your document has been created successfully.', 'success')
        return redirect(url_for('index'))
    return render_template('new_document.html')

@app.route('/document/<int:id>/edit', methods=['GET', 'POST'])
def edit_document(id):
    document = Document.query.get_or_404(id)
    if request.method == 'POST':
        markup_type = request.form['markup-type']
        markup_text = request.form['markup-text']
        if markup_type and markup_text:
            document.content = add_markup(document.content, markup_type, markup_text)
            db.session.commit()
    return render_template('edit_document.html', document=document)

def add_markup(html, markup_type, markup_text):
    soup = BeautifulSoup(html, 'html.parser')
    new_tag = soup.new_tag('span')
    new_tag['class'] = markup_type
    new_tag.string = markup_text
    soup.body.append(new_tag)
    return str(soup)

# Flask route to save or update a document
@app.route("/save_document", methods=["POST"])
def save_document():
    data = request.get_json()
    document_id = data.get("document_id")
    title = data.get("title")
    content = data.get("content")

    # Check if a document with the given ID already exists
    document = Document.query.filter_by(id=document_id).first()

    if document:
        # Update the existing document
        document.title = title
        document.content = content
        document.updated_at = datetime.utcnow()
    else:
        # Create a new document
        new_document = Document(title=title, content=content)
        db.session.add(new_document)

    db.session.commit()
    return jsonify({"message": "Document saved successfully!"})

# Flask route to fetch a document by its ID
@app.route("/get_document/<int:document_id>")
def get_document(document_id):
    document = Document.query.get(document_id)
    if document:
        return jsonify({"title": document.title, "content": document.content})
    else:
        return jsonify({"error": "Document not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)