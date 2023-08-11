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

  buttons.forEach(buttonDetails => {
    const button = document.querySelector(buttonDetails.buttonSelector);
    button.addEventListener("click", function () {
      const selection = window.getSelection();
      if (selection.toString().trim() !== "") {
        const range = selection.getRangeAt(0);
        const span = document.createElement("span");
        span.classList.add("entity", buttonDetails.spanClass);
        span.contentEditable = false; // Set non-editable
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
          buttonDetails.spanClass
        );
        
        const panelContent = document.querySelector(`.${buttonDetails.panelClass}`);

        panelContent.appendChild(panelBlock);
      }
    });
  });

})();

export { EntityMarkingModule };
