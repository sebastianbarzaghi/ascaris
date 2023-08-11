import { createPanelBlock } from './panelBlockModule.js';

const SidePanelModule = (function () {

    function populateSidePanel() {
      var spans = document.querySelectorAll(".entity");
      var peoplePanel = document.querySelector(".people-panel-blocks");
      var placesPanel = document.querySelector(".places-panel-blocks");
      var worksPanel = document.querySelector(".works-panel-blocks");
      var organizationsPanel = document.querySelector(".organizations-panel-blocks");
      var datesPanel = document.querySelector(".dates-panel-blocks");
  
      spans.forEach(function (span) {
        if (span.classList.contains("person")) {
          var value = span.textContent;
          var iconClass = "user";
          var tabClass = "people-content";
          var entityClass = span.classList[2];
          var panelBlock = createPanelBlock(
            "person-block",
            iconClass,
            value,
            tabClass,
            entityClass
          );
          peoplePanel.appendChild(panelBlock);
        } else if (span.classList.contains("place")) {
          var value = span.textContent;
          var iconClass = "map-marker-alt";
          var tabClass = "places-content";
          var entityClass = span.classList[2];
          var panelBlock = createPanelBlock(
            "place-block",
            iconClass,
            value,
            tabClass,
            entityClass
          );
          placesPanel.appendChild(panelBlock);
      } else if (span.classList.contains("work")) {
        var value = span.textContent;
        var iconClass = "book";
        var tabClass = "works-content";
        var entityClass = span.classList[2];
        var panelBlock = createPanelBlock(
          "work-block",
          iconClass,
          value,
          tabClass,
          entityClass
        );
        worksPanel.appendChild(panelBlock);
      } else if (span.classList.contains("organization")) {
        var value = span.textContent;
        var iconClass = "building";
        var tabClass = "organizations-content";
        var entityClass = span.classList[2];
        var panelBlock = createPanelBlock(
          "organization-block",
          iconClass,
          value,
          tabClass,
          entityClass
        );
        organizationsPanel.appendChild(panelBlock);
    } else if (span.classList.contains("date")) {
      var value = span.textContent;
      var iconClass = "calendar-alt";
      var tabClass = "dates-content";
      var entityClass = span.classList[2];
      var panelBlock = createPanelBlock(
        "date-block",
        iconClass,
        value,
        tabClass,
        entityClass
      );
      datesPanel.appendChild(panelBlock);
      }
    
    })
  
    }
  
    return {
      populateSidePanel,
    };
  })();

  export { SidePanelModule };