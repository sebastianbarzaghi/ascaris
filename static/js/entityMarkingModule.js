import { createPanelBlock } from './panelBlockModule.js';

const EntityMarkingModule = (function () {

  const buttons = [
    {
      buttonSelector: ".person-button",
      spanClass: "person",
      iconClass: "user",
      panelClass: "people-content"
    },
    {
      buttonSelector: ".place-button",
      spanClass: "place",
      iconClass: "map-marker-alt",
      panelClass: "places-content"
    },
    {
      buttonSelector: ".work-button",
      spanClass: "work",
      iconClass: "book",
      panelClass: "works-content"
    },
    {
      buttonSelector: ".organization-button",
      spanClass: "organization",
      iconClass: "building",
      panelClass: "organizations-content"
    },
    {
      buttonSelector: ".date-button",
      spanClass: "date",
      iconClass: "calendar-alt",
      panelClass: "dates-content"
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
        range.surroundContents(span);
  
        const icon = document.createElement("i");
        icon.classList.add("tag-icon", "fas", `fa-${buttonDetails.iconClass}`);
        span.appendChild(icon);
  
        const panelBlock = createPanelBlock(
          `${buttonDetails.spanClass}-block`,
          buttonDetails.iconClass,
          range.toString(),
          buttonDetails.panelClass
        );
        const panelContent = document.querySelector(`.${buttonDetails.panelClass}`);
        panelContent.appendChild(panelBlock);
      }
    });
  });

})();

export { EntityMarkingModule };
