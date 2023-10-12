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

  let linkCounter = parseInt(localStorage.getItem("linkCounter")) || 1;

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
        console.log(entityData)

        // Make an HTTP POST request to create the entity
        fetch('/entity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entityData)
        })
        .then(entityResponse => entityResponse.json())
        .then(entityData => {
            // Handle the response data for the entity if needed
            console.log('Entity created:', entityData);

            // Create the reference data
            const referenceData = {
                document_id: documentId,
                entity_id: entityData.id,
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
            .then(referenceResponse => referenceResponse.json())
            .then(referenceData => {
                // Handle the response data for the reference if needed
                console.log('Reference created:', referenceData);
            })
            .catch(referenceError => {
                console.error('Error creating reference:', referenceError);
            });
        })
        .catch(entityError => {
            console.error('Error creating entity:', entityError);
        });

        const span = document.createElement("span");
        span.classList.add("entity", buttonDetails.spanClass);
        span.contentEditable = false; // Set non-editable

        span.setAttribute("data-link", linkCounter);

        span.setAttribute("data-created", new Date().toISOString());
        span.setAttribute("data-modified", new Date().toISOString());
        
        span.addEventListener("click", function(event) {
          event.preventDefault(); // Prevent selecting the span's text
          span.classList.toggle("selected"); // Toggle the selected class
        });
        range.surroundContents(span);
  
        const icon = document.createElement("i");
        icon.classList.add("tag-icon", "fas", `fa-${buttonDetails.iconClass}`);
        span.appendChild(icon);
  
        const panelBlock = createPanelBlock(
          `${buttonDetails.spanClass}-block`,
          buttonDetails.iconClass,
          range.toString(),
          buttonDetails.panelClass,
          buttonDetails.spanClass,
          span.getAttribute("data-link")
        );

        const panelContent = document.querySelector(`.${buttonDetails.panelClass}`);
        panelContent.appendChild(panelBlock);

        linkCounter++;

        localStorage.setItem("linkCounter", linkCounter.toString());
      }
    });
  });

})();

export { EntityMarkingModule };
