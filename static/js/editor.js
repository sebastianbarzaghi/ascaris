var personButton = document.getElementById("person-button");
personButton.addEventListener("click", handlePersonButtonClick);

var quill = new Quill('#editor-container', {
    theme: 'snow'
});


function handlePersonButtonClick() {
  var selection = quill.getSelection();
  if (!selection || selection.length === 0) {
    return;
  }
  quill.formatText(selection.index, selection.length, {
    person: true,
    'background-color': 'yellow'
  });
  
  var editorContent = JSON.stringify(quill.getContents());
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/save-document");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(editorContent);
  
  quill.setSelection(selection.index + selection.length, 0);
}