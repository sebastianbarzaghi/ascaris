from datetime import datetime
from config import db, ma
from marshmallow_sqlalchemy import fields

class Image(db.Model):
    __tablename__ = "image"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"))
    name = db.Column(db.String)

class ImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Image
        load_instance = True
        sqla_session = db.session
        include_fk = True

class Annotation(db.Model):
    __tablename__ = "annotation"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"))
    reference_id = db.Column(db.Integer, db.ForeignKey("reference.id"))
    text = db.Column(db.String)
    motivation = db.Column(db.String)
    language = db.Column(db.String)
    license = db.Column(db.String)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class AnnotationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Annotation
        load_instance = True
        sqla_session = db.session
        include_fk = True

class Reference(db.Model):
    __tablename__ = "reference"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"))
    entity_id = db.Column(db.Integer, db.ForeignKey("entity.id"))
    text = db.Column(db.String)
    type = db.Column(db.String)
    annotation = db.relationship(
        Annotation,
        backref="annotation",
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)

class ReferenceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Reference
        load_instance = True
        sqla_session = db.session
        include_fk = True
    annotation = fields.Nested(AnnotationSchema, many=True)

class Entity(db.Model):
    __tablename__ = "entity"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"))
    type = db.Column(db.String)
    label = db.Column(db.String)
    authority = db.Column(db.String)
    reference = db.relationship(
        Reference,
        backref="reference",
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)

class EntitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Entity
        load_instance = True
        sqla_session = db.session
        include_fk = True
    reference = fields.Nested(ReferenceSchema, many=True)

class Title(db.Model):
    __tablename__ = "title"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"))
    text = db.Column(db.String)
    language = db.Column(db.String)

class TitleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Title
        load_instance = True
        sqla_session = db.session
        include_fk = True

class Responsibility(db.Model):
    __tablename__ = "responsibility"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"))
    surname = db.Column(db.String)
    name = db.Column(db.String)
    authority = db.Column(db.String)
    role = db.Column(db.String)

class ResponsibilitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Responsibility
        load_instance = True
        sqla_session = db.session
        include_fk = True

class PubAuthority(db.Model):
    __tablename__ = "pub_authority"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    name = db.Column(db.String)
    authority = db.Column(db.String)
    role = db.Column(db.String)

class PubAuthoritySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PubAuthority
        load_instance = True
        sqla_session = db.session
        include_fk = True

class PubPlace(db.Model):
    __tablename__ = "pub_place"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    name = db.Column(db.String)
    authority = db.Column(db.String)

class PubPlaceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PubPlace
        load_instance = True
        sqla_session = db.session
        include_fk = True

class PubDate(db.Model):
    __tablename__ = "pub_date"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    date = db.Column(db.DateTime)

class PubDateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PubDate
        load_instance = True
        sqla_session = db.session
        include_fk = True

class Identifier(db.Model):
    __tablename__ = "identifier"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)
    type = db.Column(db.String)

class IdentifierSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Identifier
        load_instance = True
        sqla_session = db.session
        include_fk = True

class License(db.Model):
    __tablename__ = "license"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)
    link = db.Column(db.String)

class LicenseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = License
        load_instance = True
        sqla_session = db.session
        include_fk = True

class Source(db.Model):
    __tablename__ = "source"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)

class SourceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Source
        load_instance = True
        sqla_session = db.session
        include_fk = True

class Note(db.Model):
    __tablename__ = "note"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)

class NoteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Note
        load_instance = True,
        sqla_session = db.session
        include_fk = True

class Abstract(db.Model):
    __tablename__ = "abstract"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    text = db.Column(db.String)

class AbstractSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Abstract
        load_instance = True
        sqla_session = db.session
        include_fk = True

class CreationDate(db.Model):
    __tablename__ = "creation_date"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    date = db.Column(db.DateTime)

class CreationDateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CreationDate
        load_instance = True
        sqla_session = db.session
        include_fk = True

class Category(db.Model):
    __tablename__ = "category"
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'))
    type = db.Column(db.String)

class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True
        sqla_session = db.session
        include_fk = True

class Document(db.Model):
    __tablename__ = "document"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    docTitle = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image = db.relationship(
        Image,
        backref="document",
        single_parent=True,
        lazy=True
    )
    title = db.relationship(
        Title,
        backref="document",
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)
    responsibility = db.relationship(
        Responsibility, 
        backref='document', 
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)
    pubAuthority = db.relationship(
        PubAuthority, 
        backref='document', 
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)
    pubPlace = db.relationship(
        PubPlace, 
        backref='document', 
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)
    pubDate = db.relationship(
        PubDate, 
        backref='document',
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)
    identifier = db.relationship(
        Identifier,
        backref='document',
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)
    license = db.relationship(
        License, 
        backref='document',
        cascade="all, delete, delete-orphan",
        single_parent=True, 
        lazy=True)
    source = db.relationship(
        Source, 
        backref='document',
        cascade="all, delete, delete-orphan",
        single_parent=True, 
        lazy=True)
    note = db.relationship(
        Note,
        backref='document',
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)
    abstract = db.relationship(
        Abstract, 
        backref='document',
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)
    creationDate = db.relationship(
        CreationDate, 
        backref='document',
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)
    category = db.relationship(
        Category, 
        backref='document',
        cascade="all, delete, delete-orphan",
        single_parent=True,
        lazy=True)
    entity = db.relationship(
        Entity,
        backref='document',
        cascade='all, delete, delete-orphan',
        single_parent=True,
        lazy=True)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Document {self.id}>"

class DocumentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Document
        load_instance = True
        sqla_session = db.session
        include_relationships = True
    image = fields.Nested(ImageSchema, many=True)
    title = fields.Nested(TitleSchema, many=True)
    responsibility = fields.Nested(ResponsibilitySchema, many=True)
    pubAuthority = fields.Nested(PubAuthoritySchema, many=True)
    pubPlace = fields.Nested(PubPlaceSchema, many=True)
    pubDate = fields.Nested(PubDateSchema, many=True)
    identifier = fields.Nested(IdentifierSchema, many=True)
    license = fields.Nested(LicenseSchema, many=True)
    source = fields.Nested(SourceSchema, many=True)
    note = fields.Nested(NoteSchema, many=True)
    abstract = fields.Nested(AbstractSchema, many=True)
    creationDate = fields.Nested(CreationDateSchema, many=True)
    category = fields.Nested(CategorySchema, many=True)
    entity = fields.Nested(EntitySchema, many=True)
    reference = fields.Nested(ReferenceSchema, many=True)

title_schema = TitleSchema()
responsibility_schema = ResponsibilitySchema()
pubAuthority_schema = PubAuthoritySchema()
pubPlace_schema = PubPlaceSchema()
pubDate_schema = PubDateSchema()
identifier_schema = IdentifierSchema()
license_schema = LicenseSchema()
source_schema = SourceSchema()
note_schema = NoteSchema()
abstract_schema = AbstractSchema()
creationDate_schema = CreationDateSchema()
category_schema = CategorySchema()

entity_schema = EntitySchema()
entities_schema = EntitySchema(many=True)
reference_schema = ReferenceSchema()
annotation_schema = AnnotationSchema()

image_schema = ImageSchema()
images_schema = ImageSchema(many=True)

document_schema = DocumentSchema()
documents_schema = DocumentSchema(many=True)