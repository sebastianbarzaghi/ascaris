import { TabsModule } from './tabsModule.js';
import { EntityMarkingModule } from './entityMarkingModule.js';
import { createPanelBlock } from './panelBlockModule.js';
import { SidePanelModule } from './sidePanelModule.js';
import { SaveDocumentModule } from './saveDocumentModule.js';
import { InterfaceModule } from './interfaceModule.js'

// main code
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the Tabs module
  TabsModule.initializeTabs();

  // Initialize the Side Panel module
  SidePanelModule.populateSidePanel();

  // Initialize the Save Document module
  SaveDocumentModule.initializeModule();

  // Initialize the Auto Markup module
  // AutoMarkUpModule();

});
