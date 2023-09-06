import { FormFieldsModule } from './formFieldsModule.js';

function createPanelBlock(blockClass, iconClass, value, tabClass, type, dataLink) {
    var block = document.createElement("div");
    block.classList.add("box", "panel-block", blockClass);
    block.setAttribute("data-value", value);
    block.setAttribute("data-link", dataLink)
  
    var accordionHeader = document.createElement("a");
    accordionHeader.classList.add("accordion-header");
    accordionHeader.setAttribute("role", "button");
    accordionHeader.setAttribute("aria-expanded", "false");
    accordionHeader.innerHTML = '<span class="panel-icon"><i class="fas fa-' + iconClass + '"></i></span>';
    accordionHeader.innerHTML += '<span class="panel-text">' + value + '</span>';
  
    // Add the delete button to the accordion header
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-remove"></i>';
    deleteButton.classList.add("delete-button");
  
    // Add the counter element to the accordion header
    var counter = document.createElement("span");
    counter.classList.add("counter", "tag", "is-info", "is-light");
    counter.textContent = "1";
  
    var accordionUtilities = document.createElement("div");
    accordionUtilities.classList.add("accordion-utilities");
    accordionUtilities.appendChild(counter);
    accordionUtilities.appendChild(deleteButton);
    
    var headerWrapper = document.createElement("div");
    headerWrapper.classList.add("header-wrapper");
    headerWrapper.appendChild(accordionHeader);
    headerWrapper.appendChild(accordionUtilities);
    block.appendChild(headerWrapper);
  
    var accordionContent = document.createElement("div");
    accordionContent.classList.add("accordion-content", "is-hidden"); // Add is-hidden class to keep it closed by default
    accordionContent.innerHTML = FormFieldsModule.createFormFieldTemplates(type); // Function to get the form fields based on the type
    block.appendChild(accordionContent);


    const secondChild = block.children[1];
    function injectEntityData(field, type) {
      let fieldInput = secondChild.querySelector(`[name="${field}"]`);
      if (fieldInput) {
        fieldInput.addEventListener(type, () => {
          const value = fieldInput.value;
          const entityLink = block.getAttribute("data-link");
          const entitySpan = document.querySelector(`.entity[data-link="${entityLink}"]`);
          if (entitySpan) {
            entitySpan.setAttribute(`data-${field}`, value);
          }
        })
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

      
    // Add a click event listener to the accordion header to toggle the accordion content
    accordionHeader.addEventListener("click", function () {
      var isExpanded = accordionHeader.getAttribute("aria-expanded");
      if (isExpanded === "false") {
        accordionHeader.setAttribute("aria-expanded", "true");
      } else {
        accordionHeader.setAttribute("aria-expanded", "false");
      }
      accordionContent.classList.toggle("is-hidden");
    });
  
    // Add a click event listener to the delete button to remove the block and the parent span
    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent the accordion from being toggled when clicking the delete button
      block.remove(); // Remove the accordion block
      // Find the parent span of the accordion header, which represents the marked-up text
      var spans = document.querySelectorAll(".entity");
      spans.forEach(function (span) {
        if (span.textContent === value) {
          span.outerHTML = span.textContent; // Replace the span with its inner text content
        }
      });
    });
  
    return block;
  
    }

  export { createPanelBlock };