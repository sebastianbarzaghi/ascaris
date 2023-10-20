import { createPanelBlock } from './panelBlockModule.js';

const EntityMarkingModule = (function () {

  const buttons = [
    {
      buttonSelector: ".person-button",
      spanClass: "person",
      iconClass: "user",
      panelClass: "people-panel-blocks"
    },
    {
      buttonSelector: ".place-button",
      spanClass: "place",
      iconClass: "map-marker-alt",
      panelClass: "places-panel-blocks"
    },
    {
      buttonSelector: ".work-button",
      spanClass: "work",
      iconClass: "book",
      panelClass: "works-panel-blocks"
    },
    {
      buttonSelector: ".organization-button",
      spanClass: "organization",
      iconClass: "building",
      panelClass: "organizations-panel-blocks"
    },
    {
      buttonSelector: ".date-button",
      spanClass: "date",
      iconClass: "calendar-alt",
      panelClass: "dates-panel-blocks"
    }
  ];

  const documentId = document.querySelector('#editableContent').getAttribute('data-documentId');

  buttons.forEach(buttonDetails => {
    const button = document.querySelector(buttonDetails.buttonSelector);
    button.addEventListener("click", function () {
      const selection = window.getSelection();
      if (selection.toString().trim() !== "") {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        // Create the entity data
        const entityData = {
          document_id: documentId,
          label: selectedText,
          type: buttonDetails.spanClass,
          authority: null
        };

        // Make an HTTP POST request to create the entity
        fetch('/entity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entityData)
        })
        .then(entityResponse => entityResponse.json())
        .then(entityDataResponse => {
            
            // Create the reference data
            const referenceData = {
                document_id: documentId,
                entity_id: entityDataResponse.id,
                text: selectedText,
                type: buttonDetails.spanClass
            };

            // Make an HTTP POST request to create the reference
            fetch('/reference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(referenceData)
            })
            .then((referenceResponse) => referenceResponse.json())
            .then((referenceDataResponse) => {
              const span = document.createElement("span");
              span.classList.add("button", "reference", referenceDataResponse.type);
              span.contentEditable = false;
              span.setAttribute("id", `reference-${referenceDataResponse.id}`);
              span.setAttribute("data-id", referenceDataResponse.id);
              span.setAttribute("data-entity", referenceDataResponse.entity_id);

              span.addEventListener("click", function(event) {
                event.preventDefault();
                span.classList.toggle("selected");
              });

              range.surroundContents(span);
              const icon = document.createElement("i");
              icon.classList.add("tag-icon", "fas", `fa-${referenceDataResponse.type}`);
              span.appendChild(icon);

                    // Make an HTTP POST request to create the entity
              fetch(`/entity/${referenceDataResponse.entity_id}`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json'
                  },
              })
            
            .then(entityGetResponse => entityGetResponse.json())
            .then(entityGetDataResponse => {
              
              // Create entity box
              const block = createPanelBlock(entityGetDataResponse, entityGetDataResponse.reference);
              const panelContent = document.querySelector(`.${buttonDetails.panelClass}`);
              panelContent.appendChild(block);

            })
          })
            
            .catch(referenceError => {
                console.error('Error creating reference:', referenceError);
            });
        })
        .catch(entityError => {
            console.error('Error creating entity:', entityError);
        });

      }
    });

  });

  const references = document.querySelectorAll(".reference");
    references.forEach((reference) => {
      reference.addEventListener("click", function(event) {
        event.preventDefault();
        fetch(`/reference/${reference.getAttribute("data-id")}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(referenceData => {

          const modal = document.querySelector(`.annotation-modal[data-reference="${referenceData.id}"]`);
          modal.classList.add('is-active');
          const addAnnotationButton = modal.querySelector('.add-annotation-button');
          
          addAnnotationButton.addEventListener('click', function(event) {
            event.preventDefault();
            // Create an object with the annotation data
            const annotationData = {
              "document_id": documentId,
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
                          <form method="PUT">
                              <div class="field">
                                  <label class="label">Text</label>
                                  <div class="control">
                                      <textarea class="textarea" placeholder="Enter annotation content"></textarea>
                                  </div>
                              </div>
                              <div class="field is-grouped">
                                  <div class="control">
                                      <label class="label">Language</label>
                                      <div class="select">
                                          <select>
                                              <option value="">--Select--</option>
                                              <option value="it">it</option>
                                              <option value="en">en</option>
                                          </select>
                                      </div>
                                  </div>
                                  <div class="control">
                                      <label class="label">Motivation</label>
                                      <div class="select">
                                          <select>
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
                                          <select id="license-link" name="license-link" class="dropdown">
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
                                      <p>${data.created_at}</p>
                                  </div>
                                  <div class="control">
                                      <label class="label">Modified at</label>
                                      <p>${data.updated_at }</p>
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
              annotationCard.innerHTML = annotationHTML;
              modalBody.appendChild(annotationCard);
            })
            .catch(error => {
              console.error('Error:', error);
            });
          });
        })
        .catch(error => {
            console.error("Error fetching reference data: ", error);
        });
      });
    })

})();

export { EntityMarkingModule };
