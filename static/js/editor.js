import { TabsModule } from './tabsModule.js';
import { EntityMarkingModule } from './entityMarkingModule.js';
import { createPanelBlock } from './panelBlockModule.js';
import { SidePanelModule } from './sidePanelModule.js';
import { SaveDocumentModule } from './saveDocumentModule.js';
import { InterfaceModule } from './interfaceModule.js'
import { EntityInteractionModule } from './entityInteractionModule.js'
import { DownloadModule } from './downloadModule.js'

const documentId = document.querySelector('#editableContent').getAttribute('data-documentId');

// main code
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the Tabs module
  TabsModule.initializeTabs();

  // Initialize the Side Panel module
  SidePanelModule.populateSidePanel();

  // Initialize the Save Document module
  SaveDocumentModule.startAutoSave(documentId);

  // Initialize the Auto Markup module
  // AutoMarkUpModule();

});
