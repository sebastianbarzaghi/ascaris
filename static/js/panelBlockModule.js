import { FormFieldsModule } from './formFieldsModule.js';

function createPanelBlock(entityData) {

  let block = document.createElement("div");
  block.classList.add(
    "box", 
    "panel-block", 
    `${entityData.type}-block`
    );
  block.setAttribute("id", `entity-${entityData.id}`);
  block.setAttribute("data-id", entityData.id);
  block.setAttribute("draggable", true);

  let headerWrapper = document.createElement("div");
  headerWrapper.classList.add("header-wrapper");

  let panelIcon = document.createElement("span");
  panelIcon.classList.add("panel-icon");

  let icon = document.createElement("i");
  icon.classList.add("fas", `fa-${entityData.type}`);
  panelIcon.appendChild(icon);

  headerWrapper.appendChild(panelIcon);
  console.log(entityData)
  let accordionHeader = document.createElement("a");
  accordionHeader.classList.add("accordion-header");
  accordionHeader.setAttribute("role", "button");
  accordionHeader.setAttribute("aria-expanded", false);
  entityData.reference.forEach((reference) => {
    accordionHeader.textContent += reference;
  })
  headerWrapper.appendChild(accordionHeader);
  
  let accordionUtilities = document.createElement("div");
  accordionUtilities.classList.add("accordion-utilities");

  let entityReferenceCounter = document.createElement("span");
  entityReferenceCounter.classList.add(
    "counter", 
    "tag", 
    "is-info", 
    "is-light"
  );
  entityReferenceCounter.textContent = entityData.reference.length;
  console.log(entityData.reference.length)
  accordionUtilities.appendChild(entityReferenceCounter);

  let entityDeleteButton = document.createElement("button");
  entityDeleteButton.classList.add("delete-button");

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fas", "fa-remove");
  entityDeleteButton.appendChild(deleteIcon);
  accordionUtilities.appendChild(entityDeleteButton);

  headerWrapper.appendChild(accordionUtilities);
  
  block.appendChild(headerWrapper);

  let accordionContent = document.createElement("div");
  accordionContent.classList.add("accordion-content", "is-hidden");

  let accordionForm = document.createElement("form");
  accordionForm.classList.add("entity-form");
  accordionForm.setAttribute("action", "PUT");

  let entityLabelField = document.createElement("div");
  entityLabelField.classList.add("field", "entity-label");

  let labelLabel = document.createElement("label");
  labelLabel.classList.add("label");
  labelLabel.textContent = "Label";
  entityLabelField.appendChild(labelLabel);

  let controlLabel = document.createElement("div");
  controlLabel.classList.add("control");
  
  let labelInput = document.createElement("input");
  labelInput.classList.add("input");
  labelInput.setAttribute("type", "text");
  labelInput.setAttribute("name", entityData.label);
  labelInput.setAttribute("placeholder", "Enter entity's label")
  controlLabel.appendChild(labelInput);

  entityLabelField.appendChild(controlLabel);

  let entityAuthorityField = document.createElement("div");
  entityAuthorityField.classList.add("field", "entity-authority");

  let labelAuthority = document.createElement("label");
  labelAuthority.classList.add("label");
  labelAuthority.textContent = "Authority record";
  entityAuthorityField.appendChild(labelAuthority);

  let controlAuthority = document.createElement("div");
  controlAuthority.classList.add("control");
  
  let authorityInput = document.createElement("input");
  authorityInput.classList.add("input");
  authorityInput.setAttribute("type", "text");
  authorityInput.setAttribute("name", entityData.authority);
  authorityInput.setAttribute("placeholder", "Enter entity's authority")
  controlAuthority.appendChild(authorityInput);

  entityAuthorityField.appendChild(controlAuthority);

  accordionForm.appendChild(entityLabelField);
  accordionForm.appendChild(entityAuthorityField);

  accordionContent.appendChild(accordionForm);

  block.appendChild(accordionContent);
  
    /*
    
    function updateEntities(field, value) {
      const entities = document.querySelectorAll(`.entity[data-link="${entityLink}"]`);
      entities.forEach((entity) => {
          entity.setAttribute(`data-${field}`, value);
      });
    }

    function injectEntityData(field, type) {
        let fieldInput = form.querySelector(`[name="${field}"]`);
        if (fieldInput) {
            fieldInput.addEventListener(type, () => {
                const value = fieldInput.value;
                updateEntities(field, value);
            });
        }
    }
    injectEntityData("name", "input");
    injectEntityData("sameAs", "input");
    injectEntityData("certainty", "change");
    injectEntityData("evidence", "change");
    injectEntityData("note", "input");
    injectEntityData("when", "input");
    injectEntityData("from", "input");
    injectEntityData("to", "input");
    injectEntityData("notBefore", "input");
    injectEntityData("notAfter", "input");


    function populateEntityFields(field) {
      const entityLink = block.getAttribute("data-link");
      const entitySpan = document.querySelector(`.entity[data-link="${entityLink}"]`);
      if (entitySpan) {
        const value = entitySpan.getAttribute(`data-${field}`);
        const fieldInput = block.querySelector(`[name="${field}"]`);
        if (fieldInput && value) {
          fieldInput.value = value;
        }
      }
    }
    populateEntityFields("name");
    populateEntityFields("sameAs");
    populateEntityFields("certainty");
    populateEntityFields("evidence");
    populateEntityFields("note");
    populateEntityFields("when");
    populateEntityFields("from");
    populateEntityFields("to");
    populateEntityFields("notBefore");
    populateEntityFields("notAfter");
    


    const entities = document.querySelectorAll(`.entity[data-link="${entityLink}"]`);
    for (const element of form.children) {
      element.addEventListener("input", () => {
        entities.forEach((entity) => {
          if(entity.getAttribute('data-modified')) {
            entity.setAttribute('data-modified', new Date().toISOString())
          }
        })
      })
    }
    

    // Add a click event listener to the delete button to remove the block and the parent span
    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation();
      block.remove();
      // Find the parent span of the accordion header, which represents the marked-up text
      var spans = document.querySelectorAll(".entity");
      spans.forEach(function (span) {
          if (span.getAttribute("data-link") === block.getAttribute("data-link")) {
              span.outerHTML = span.textContent; // Replace the span with its inner text content
          }
      });
    });
    */

    block.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", block.id); // Set data to be transferred
    });
    
    return block;
  
    }

    // Add a click event listener to the common ancestor of all accordions
    const entityPanel = document.querySelector('.entity-panel')
    entityPanel.addEventListener("click", function (event) {
      if (event.target.classList.contains("accordion-header")) {
        var header = event.target;
        var content = header.parentNode.nextElementSibling;
        
        var isExpanded = header.getAttribute("aria-expanded");
        if (isExpanded === "false") {
          header.setAttribute("aria-expanded", "true");
        } else {
          header.setAttribute("aria-expanded", "false");
        }
        content.classList.toggle("is-hidden");
      }
    });

  export { createPanelBlock };