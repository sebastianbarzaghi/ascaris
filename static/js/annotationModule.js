function createAnnotation(referenceData) {
    const modal = document.querySelector(`.annotation-modal[data-reference="${referenceData.id}"]`);
    modal.classList.add('is-active');
    const addAnnotationButton = modal.querySelector('.add-annotation-button');
    
    addAnnotationButton.addEventListener('click', function(event) {
    event.preventDefault();
    // Create an object with the annotation data
    const annotationData = {
        "document_id": referenceData.document_id,
        "language": "",
        "license": "",
        "motivation": "",
        "reference_id": referenceData.id,
        "text": ""
    };

    fetch('/annotation', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(annotationData),
    })
    .then(response => response.json())
    .then(data => {
        const modalBody = modal.querySelector('.modal-card-body');
        const annotationHTML = `
            <header class="card-header annotation-header">
                <p class="card-header-title">
                    Annotation ${data.reference_id}-${data.id}
                </p>
                <button class="card-header-icon" aria-label="more options">
                    <span class="icon">
                        <i class="fas fa-angle-down annotation-icon" aria-hidden="true"></i>
                    </span>
                </button>
            </header>
            <div class="card-content annotation-content">
                <div class="content">
                    <form method="PUT" class="annotation-form">
                        <div class="field">
                            <label class="label">Text</label>
                            <div class="control">
                                <textarea class="textarea annotation-text" placeholder="Enter annotation content"></textarea>
                            </div>
                        </div>
                        <div class="field is-grouped">
                            <div class="control">
                                <label class="label">Language</label>
                                <div class="select">
                                    <select class="annotation-language">
                                        <option value="">--Select--</option>
                                        <option value="it">it</option>
                                        <option value="en">en</option>
                                    </select>
                                </div>
                            </div>
                            <div class="control">
                                <label class="label">Motivation</label>
                                <div class="select">
                                    <select class="annotation-motivation">
                                        <option value="">--Select--</option>
                                        <option value="assessing">assessing</option>
                                        <option value="bookmarking">bookmarking</option>
                                        <option value="classifying">classifying</option>
                                        <option value="commenting">commenting</option>
                                        <option value="describing">describing</option>
                                        <option value="editing">editing</option>
                                        <option value="highlighting">highlighting</option>
                                        <option value="identifying">identifying</option>
                                        <option value="linking">linking</option>
                                        <option value="moderating">moderating</option>
                                        <option value="questioning">questioning</option>
                                        <option value="replying">replying</option>
                                        <option value="tagging">tagging</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Rights</label>
                            <div class="control">
                                <div class="select">
                                    <select class="annotation-license">
                                        <option value="">--Select--</option>
                                        <option 
                                        value="https://creativecommons.org/publicdomain/zero/1.0/">
                                        CC0 (Creative Commons Zero)</option>
                                        <option 
                                        value="https://creativecommons.org/licenses/by/4.0/">
                                        CC BY (Attribution)</option>
                                        <option 
                                        value="https://creativecommons.org/licenses/by-sa/4.0/">
                                        CC BY-SA (Attribution-ShareAlike)</option>
                                        <option 
                                        value="https://creativecommons.org/licenses/by-nc/4.0/">
                                        CC BY-NC (Attribution-NonCommercial)</option>
                                        <option 
                                        value="https://creativecommons.org/licenses/by-nc-sa/4.0/">
                                        CC BY-NC-SA (Attribution-NonCommercial-ShareAlike)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="field is-grouped">
                            <div class="control">
                                <label class="label">Created at</label>
                                <p class="annotation-created">${data.created_at}</p>
                            </div>
                            <div class="control">
                                <label class="label">Modified at</label>
                                <p class="annotation-modified">${data.updated_at }</p>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-link update-annotation-button">Submit</button>
                    </div>
                    <div class="control">
                        <button class="button is-link is-light delete-annotation-button">Delete</button>
                    </div>
                </div>
            </div>
        `;
        const annotationCard = document.createElement('div');
        annotationCard.className = 'card';
        annotationCard.setAttribute('data-id', data.id);
        annotationCard.innerHTML = annotationHTML;
        modalBody.appendChild(annotationCard);
        
        return modalBody
    })
    .catch(error => {
        console.error('Error:', error);
    });
    });
}

const annotationGroup = document.querySelector('.annotation-group');
const annotationCards = annotationGroup.querySelectorAll('.annotation');
annotationCards.forEach((annotationCard) => {
    const formData = {};
    const annotationFields = annotationCard.querySelectorAll('.annotation-form-field');
    annotationFields.forEach((annotationField) => {
        if (annotationField.classList.contains('annotation-text')) {
            formData.text = annotationField.value;
        } else if (annotationField.classList.contains('annotation-language')) {
            formData.language = annotationField.value;
        } else if (annotationField.classList.contains('annotation-motivation')) {
            formData.motivation = annotationField.value;
        } else if (annotationField.classList.contains('annotation-license')) {
            formData.license = annotationField.value;
        }
    });

    annotationCard.addEventListener('input', function (event) {
        if (event.target.classList.contains('annotation-form-field')) {
            const formField = event.target;
            if (formField.classList.contains('annotation-text')) {
                formData.text = formField.value;
            } else if (formField.classList.contains('annotation-language')) {
                formData.language = formField.value;
            } else if (formField.classList.contains('annotation-motivation')) {
                formData.motivation = formField.value;
            } else if (formField.classList.contains('annotation-license')) {
                formData.license = formField.value;
            }
        }
    });
    
    annotationCard.addEventListener('submit', function (event) {
        if (event.target.classList.contains('annotation-form')) {
            event.preventDefault();
            const form = event.target;
            const annotationContent = form.closest('.annotation-content');
            const annotationId = annotationContent.getAttribute('data-id');
            updateAnnotation(annotationId, formData);
        }
    });
    
    annotationCard.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-annotation-button')) {
            const deleteButton = event.target;
            const annotationCard = deleteButton.closest('.card');
            const annotationContent = deleteButton.closest('.annotation-content');
            const annotationId = annotationContent.getAttribute('data-id');
            removeAnnotation(annotationId, annotationCard);
        }
    });

})


function updateAnnotation(annotationId, updatedData) {
    fetch(`/annotation/${annotationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then((response) => {
        if (response.ok) {
            console.log(`Annotation ${annotationId} updated successfully`);
        } else {
            console.error(`Error updating annotation ${annotationId}`);
        }
    })
    .catch((error) => {
    console.error(`Error updating annotation ${annotationId}`, error);
    });

}


function removeAnnotation(annotationId, annotation) {
    fetch(`/annotation/${annotationId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Annotation deleted successfully');
        } else {
            console.error('Error deleting annotation');
        }
    })
    .catch(error => {
        console.error('Error deleting annotation', error);
    });

    annotation.remove();
}


export { createAnnotation };