const SaveDocumentModule = (function () {

  // Function to fetch the document content by ID
  function fetchDocumentContent(documentId) {
    fetch("/get_document/" + documentId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch document");
        }
      })
      .then(function (data) {
        // Set the content of the editable div
        document.getElementById("editableContent").innerHTML = data.content;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  // Function to save the document content
  function saveDocumentContent() {
    var content = document.getElementById("editableContent").innerHTML;
    var title = document.querySelector("h1").innerText.trim();

    // Get the document ID from the content area
    var documentId = document.querySelector("#editableContent").getAttribute("data-documentId");
    
    if (!documentId) {
      console.error("Document ID not provided");
      return;
    }

    fetch("/save_document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        document_id: documentId,
        title: title,
        content: content,
      }),
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to save document");
        }
      })
      .then(function (data) {
        console.log(data.message);
      })
      .catch(function (error) {
        console.error(error);
      });
    
  }

function initializeModule() {
  // Add an event listener to the "Save" button
  var saveButton = document.getElementById("saveButton");
  saveButton.addEventListener("click", saveDocumentContent);

  // Add event listeners to each document link in the sidebar
  var documentLinks = document.querySelectorAll(".document-link");
  documentLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var documentId = link.dataset.documentId;
      fetchDocumentContent(documentId);
    });
  });
}


return {
  initializeModule
};

})();

export { SaveDocumentModule };