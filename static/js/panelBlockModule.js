
function createPanelBlock(entityData, entityReferences) {

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
  let accordionHeader = document.createElement("a");
  accordionHeader.classList.add("accordion-header");
  accordionHeader.setAttribute("role", "button");
  accordionHeader.setAttribute("aria-expanded", false);
  entityReferences.forEach((reference) => {
    accordionHeader.textContent += reference.text;
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
  entityReferenceCounter.textContent = entityReferences.length;
  console.log(entityReferences.length)
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

    block.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", block.id); // Set data to be transferred
    });
    
    return block;
  
    }

    // Add a click event listener to the common ancestor of all accordions
    const entityPanel = document.querySelector('.entity-panel')
    entityPanel.addEventListener("click", function (event) {
      if (event.target.classList.contains("accordion-header")) {
        let header = event.target;
        let content = header.parentNode.nextElementSibling;
        
        let isExpanded = header.getAttribute("aria-expanded");
        if (isExpanded === "false") {
          header.setAttribute("aria-expanded", "true");
        } else {
          header.setAttribute("aria-expanded", "false");
        }
        content.classList.toggle("is-hidden");
      } else if (event.target.classList.contains("delete-button")) {
        const deleteButton = event.target;
        const block = deleteButton.parentNode.parentNode.parentNode;
        console.log(block)
        /*
        block.remove();
        let spans = document.querySelectorAll(".reference");
        spans.forEach(function (span) {
            if (span.getAttribute("data-link") === block.getAttribute("data-link")) {
                span.outerHTML = span.textContent; // Replace the span with its inner text content
            }
        });
        */
      }
    });

  export { createPanelBlock };