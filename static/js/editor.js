import { TabsModule } from './tabsModule.js';
import { EntityMarkingModule } from './entityMarkingModule.js';
import { createPanelBlock } from './panelBlockModule.js';
import { FormFieldsModule } from './formFieldsModule.js';
import { SidePanelModule } from './sidePanelModule.js';
import { ModalModule } from './modalModule.js';
import { SaveDocumentModule } from './saveDocumentModule.js';
import { AutoMarkUpModule } from './autoMarkupModule.js';

// main code
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the Tabs module
  TabsModule.initializeTabs();

  // Initialize the Panel Block module
  createPanelBlock();

  // Initialize the Form Fields module
  FormFieldsModule();

  // Initialize the Side Panel module
  SidePanelModule.populateSidePanel();

  // Initialize the Save Document module
  SaveDocumentModule.initializeModule();

  // Initialize the Auto Markup module
  // AutoMarkUpModule();
});
