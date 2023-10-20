import { createPanelBlock } from './panelBlockModule.js';
import { createAnnotation } from './annotationModule.js';

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
                document_id: entityDataResponse.document_id,
                entity_id: entityDataResponse.id,
                text: selectedText,
                type: entityDataResponse.type
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

              let annotationCounter = document.createElement("span");
              annotationCounter.classList.add(
                "counter", 
                "tag", 
                "is-info",
                "is-light"
              );
              annotationCounter.textContent = referenceDataResponse.annotation.length;
              span.appendChild(annotationCounter);


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

          createAnnotation(referenceData);
          
        })
        .catch(error => {
            console.error("Error fetching reference data: ", error);
        });
      });
    })

})();

export { EntityMarkingModule };
