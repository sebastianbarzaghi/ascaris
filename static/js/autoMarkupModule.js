const AutoMarkUpModule = (function () {

  // Function to find all instances of a given text and wrap them in a span with class "entity"
  function wrapTextInstances(text) {
    var textNodes = [];
    function findTextNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var index = node.textContent.indexOf(text);
        if (index !== -1) {
          textNodes.push({ node: node, index: index });
        }
      } else {
        node.childNodes.forEach(findTextNodes);
      }
    }
    findTextNodes(document.body);
  
    textNodes.forEach(function (textNode) {
      var startIndex = textNode.index;
      var endIndex = startIndex + text.length;
      var span = document.createElement("span");
      span.classList.add("entity", "person");
      span.textContent = text;
      textNode.node.splitText(startIndex);
      textNode.node.nextSibling.splitText(endIndex - startIndex);
      textNode.node.parentNode.replaceChild(span, textNode.node.nextSibling);
    });
  }
  
  // Add an event listener to the checkbox to detect when it is toggled
  var autoMarkUpCheckbox = document.getElementById("autoMarkUpCheckbox");
  autoMarkUpCheckbox.addEventListener("change", function () {
    // Check if the checkbox is checked (activated)
    var autoMarkUpActivated = autoMarkUpCheckbox.checked;
  
    // Function to update the count of a given entity
    function updateEntityCount(entity) {
      var count = document.querySelectorAll(".entity.person[data-value='" + entity.textContent + "']").length;
      entity.querySelector(".counter").textContent = count;
    }
  
    // Wait for the DOM to be fully loaded before wrapping the text instances
    document.addEventListener("DOMContentLoaded", function () {
      var editorContent = document.querySelector(".editor-content");
      editorContent.addEventListener("mouseup", function () {
        // Get the selected (highlighted) text
        var selection = window.getSelection();
        var selectedText = selection.toString().trim();
  
        if (autoMarkUpActivated && selectedText !== "") {
          // Wrap all instances of the selected text in spans with class "entity"
          wrapTextInstances(selectedText);
  
          // Update the count for all matching entities
          var allEntities = document.querySelectorAll(".entity.person");
          allEntities.forEach(updateEntityCount);
        }
      });
    });
    });
  })();

export { AutoMarkUpModule };