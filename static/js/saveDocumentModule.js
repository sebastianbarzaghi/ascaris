const SaveDocumentModule = (function () {

  function startAutoSave(documentId) {
    const editableContent = document.getElementById("editableContent");

    // Create a MutationObserver to detect changes in the content
    const observer = new MutationObserver(function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" || mutation.type === "characterData") {
          // Content has changed, initiate an auto-save
          autoSaveDocumentContent(documentId, editableContent.innerHTML);
        }
      }
    });

    // Configure the observer to monitor changes in the content
    observer.observe(editableContent, { subtree: true, characterData: true, childList: true });
  }

  // Function to autosave the document content
  function autoSaveDocumentContent(documentId, content) {
    const title = document.querySelector("h1").innerText.trim();

    // Send an HTTP POST request to the backend to save the updated content
    fetch("/save_document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: documentId,
        docTitle: title,
        content: content,
      }),
    })
      .then(function (response) {
        if (response.ok) {
          console.log("Successful autosave");
          return response.json();
        } else {
          throw new Error("Failed to autosave document");
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return {
    startAutoSave,
  };
})();

export { SaveDocumentModule };