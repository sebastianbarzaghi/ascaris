import { createPanelBlock } from './panelBlockModule.js';

const SidePanelModule = (function () {

    function populateSidePanel() {
      var spans = document.querySelectorAll(".reference");
      var peoplePanel = document.querySelector(".people-panel-blocks");
      var placesPanel = document.querySelector(".places-panel-blocks");
      var worksPanel = document.querySelector(".works-panel-blocks");
      var organizationsPanel = document.querySelector(".organizations-panel-blocks");
      var datesPanel = document.querySelector(".dates-panel-blocks");
  
      
    
    }
  
    return {
      populateSidePanel,
    };
  })();

  export { SidePanelModule };