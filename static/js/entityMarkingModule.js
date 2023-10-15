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
              span.setAttribute("id", `reference-${referenceDataResponse.id}`)
              span.setAttribute("data-entity", referenceDataResponse.entity_id);

              span.addEventListener("click", function(event) {
                event.preventDefault();
                span.classList.toggle("selected");
              });

              range.surroundContents(span);
              const icon = document.createElement("i");
              icon.classList.add("tag-icon", "fas", `fa-${referenceDataResponse.type}`);
              span.appendChild(icon);
              
              // Create entity box
              console.log(entityDataResponse)
              const block = createPanelBlock(entityDataResponse);
              const panelContent = document.querySelector(`.${buttonDetails.panelClass}`);
              panelContent.appendChild(block);

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

})();

export { EntityMarkingModule };
