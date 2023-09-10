const TabsModule = (function () {
  
    function openTab(event, tabName) {
      var i, tabcontent, tablinks;
      tablinks = document.getElementsByClassName("tab");
      tabcontent = document.getElementsByClassName("panel-content");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("is-active");
      }
      document.querySelector("." + tabName + "-content").style.display = "block";
      event.currentTarget.classList.add("is-active");
    }
  
    function initializeTabs() {
      var tablinks = document.querySelectorAll(".tab");
      tablinks.forEach(function (tablink) {
        tablink.addEventListener("click", function (event) {
          openTab(event, tablink.dataset.name);
        });
      });
    }

    const editorPanel = document.querySelector(".editor-panel");
    const metadataPanel = document.querySelector(".metadata-panel");

    const tabs = document.querySelectorAll(".editor-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", function() {
            if (tab.classList.contains("is-active")) return;

            tabs.forEach(t => t.classList.remove("is-active"));
            tab.classList.add("is-active");

            if (tab.classList.contains("text-tab")) {
                editorPanel.style.display = "block";
                metadataPanel.style.display = "none";
            } else if (tab.classList.contains("metadata-tab")) {
                editorPanel.style.display = "none";
                metadataPanel.style.display = "block";
            }
        });
    });

    const content = document.getElementById('editableContent');

    content.addEventListener('paste', function (event) {
      event.preventDefault();
    
      // Get the pasted text as plain text
      const plainText = (event.clipboardData || window.clipboardData).getData('text/plain');
    
      // Create a plain text node
      const plainTextNode = document.createTextNode(plainText);
    
      // Insert the plain text node into the contenteditable div
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(plainTextNode);
      }
    });

    // Function to create a new paragraph element
function createParagraph() {
  const newParagraph = document.createElement('br');
  return newParagraph;
}

editableContent.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();

    // Get the current selection
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Create a new paragraph element
    const newParagraph = createParagraph();

    // Insert the new paragraph before the next element
    range.insertNode(newParagraph);
    range.setStartBefore(newParagraph);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

    return {
      openTab,
      initializeTabs,
    };

  })();

  export { TabsModule };