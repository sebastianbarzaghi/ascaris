document.addEventListener("DOMContentLoaded", function () {

  // Get the content container
  var content = document.querySelector(".content");

  // Function to show the content of the selected tab
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
  
  // Add click event listeners to the tab elements
  var tablinks = document.querySelectorAll(".tab");
  tablinks.forEach(function (tablink) {
    tablink.addEventListener("click", function (event) {
      openTab(event, tablink.dataset.name);
    });
  });
  
  // Add click event listeners to the tab elements
  tablinks.forEach(function (tablink) {
    tablink.addEventListener("click", function (event) {
      openTab(event, tablink.dataset.name);
    });
  });

  // Add click event listeners to the toolbar buttons
  var personButton = document.querySelector(".person-button");
  var placeButton = document.querySelector(".place-button");
  var workButton = document.querySelector(".work-button");
  var organizationButton = document.querySelector(".organization-button");
  var dateButton = document.querySelector(".date-button");

  personButton.addEventListener("click", function () {
    var selection = window.getSelection();
    if (selection.toString().trim() !== "") {
      var range = selection.getRangeAt(0);
      var span = document.createElement("span");
      span.classList.add("entity");
      span.classList.add("person");
      range.surroundContents(span);

      // Create and append the icon element
      var icon = document.createElement("i");
      icon.classList.add("tag-icon", "fas", "fa-user");
      span.appendChild(icon);

      var panelBlock = createPanelBlock("person-block", "user", range.toString(), "people-content");
      var panelContent = document.querySelector(".people-content");
      panelContent.appendChild(panelBlock);
    }
  });

  placeButton.addEventListener("click", function () {
    var selection = window.getSelection();
    if (selection.toString().trim() !== "") {
      var range = selection.getRangeAt(0);
      var span = document.createElement("span");
      span.classList.add("entity");
      span.classList.add("place");
      range.surroundContents(span);

      // Create and append the icon element
      var icon = document.createElement("i");
      icon.classList.add("tag-icon", "fas", "fa-map-marker-alt");
      span.appendChild(icon);

      var panelBlock = createPanelBlock("place-block", "map-marker-alt", range.toString(), "places-content");
      var panelContent = document.querySelector(".places-content");
      panelContent.appendChild(panelBlock);
    }
  });

  workButton.addEventListener("click", function () {
    var selection = window.getSelection();
    if (selection.toString().trim() !== "") {
      var range = selection.getRangeAt(0);
      var span = document.createElement("span");
      span.classList.add("entity");
      span.classList.add("work");
      range.surroundContents(span);

      // Create and append the icon element
      var icon = document.createElement("i");
      icon.classList.add("tag-icon", "fas", "fa-book");
      span.appendChild(icon);

      var panelBlock = createPanelBlock("work-block", "book", range.toString(), "works-content");
      var panelContent = document.querySelector(".works-content");
      panelContent.appendChild(panelBlock);
    }
  });

  organizationButton.addEventListener("click", function () {
    var selection = window.getSelection();
    if (selection.toString().trim() !== "") {
      var range = selection.getRangeAt(0);
      var span = document.createElement("span");
      span.classList.add("entity");
      span.classList.add("organization");
      range.surroundContents(span);

      // Create and append the icon element
      var icon = document.createElement("i");
      icon.classList.add("tag-icon", "fas", "fa-building");
      span.appendChild(icon);

      var panelBlock = createPanelBlock("organization-block", "building", range.toString(), "organizations-content");
      var panelContent = document.querySelector(".organizations-content");
      panelContent.appendChild(panelBlock);
    }
  });

  dateButton.addEventListener("click", function () {
    var selection = window.getSelection();
    if (selection.toString().trim() !== "") {
      var range = selection.getRangeAt(0);
      var span = document.createElement("span");
      span.classList.add("entity");
      span.classList.add("date");
      range.surroundContents(span);

      // Create and append the icon element
      var icon = document.createElement("i");
      icon.classList.add("tag-icon", "fas", "fa-calendar-alt");
      span.appendChild(icon);

      var panelBlock = createPanelBlock("date-block", "calendar-alt", range.toString(), "dates-content");
      var panelContent = document.querySelector(".dates-content");
      panelContent.appendChild(panelBlock);
    }
  });

  // Additional click event listener for the editor's content area
  content.addEventListener("click", function (event) {
    var target = event.target;
    if (target.tagName === "SPAN") {
      var value = target.textContent;
      var tabClass = target.classList[1] + "-content";
      var panelBlock = createPanelBlock(
        target.classList[1] + "-block",
        "user",
        value,
        tabClass
      );

      var panelBlocks = document.querySelector("." + tabClass + "-blocks");
      panelBlocks.appendChild(panelBlock);
    }
  });

// Updated createPanelBlock function
function createPanelBlock(blockClass, iconClass, value, tabClass, type) {
  var block = document.createElement("div");
  block.classList.add("box", "panel-block", blockClass);
  block.setAttribute("data-value", value);

  var accordionHeader = document.createElement("a");
  accordionHeader.classList.add("accordion-header");
  accordionHeader.setAttribute("role", "button");
  accordionHeader.setAttribute("aria-expanded", "false");
  accordionHeader.innerHTML = '<span class="panel-icon"><i class="fas fa-' + iconClass + '"></i></span>';
  accordionHeader.innerHTML += '<span class="panel-text">' + value + '</span>';
  block.appendChild(accordionHeader);

  var accordionContent = document.createElement("div");
  accordionContent.classList.add("accordion-content", "is-hidden"); // Add is-hidden class to keep it closed by default
  accordionContent.innerHTML = getFormFields(type); // Function to get the form fields based on the type
  block.appendChild(accordionContent);

  // Add a click event listener to the accordion header to toggle the accordion content
  accordionHeader.addEventListener("click", function () {
    var isExpanded = accordionHeader.getAttribute("aria-expanded");
    if (isExpanded === "false") {
      accordionHeader.setAttribute("aria-expanded", "true");
    } else {
      accordionHeader.setAttribute("aria-expanded", "false");
    }
    accordionContent.classList.toggle("is-hidden");
  });

  return block;
}

function getFormFields(type) {
  function createFormFields(fields) {
    return fields
      .map((field) => {
        if (field.type === "text") {
          return `
            <div class="field">
              <label class="label">${field.label}</label>
              <div class="control">
                <input class="input" type="text" name="${field.name}" placeholder="Enter ${field.label.toLowerCase()}">
              </div>
            </div>
          `;
        } else if (field.type === "date") {
          return `
            <div class="field">
              <label class="label">${field.label}</label>
              <div class="control">
                <input class="input" type="date" name="${field.name}">
              </div>
            </div>
          `;
        } else if (field.type === "select") {
          const selectOptions = field.options
            .map((option) => `<option>${option}</option>`)
            .join('');
          return `
            <div class="field">
              <label class="label">${field.label}</label>
              <div class="control">
                <div class="select">
                  <select name="${field.name}">
                    ${selectOptions}
                  </select>
                </div>
              </div>
            </div>
          `;
        }
      })
      .join('\n');
  }

  const formFieldTemplates = {
    person: createFormFields([
      { label: "Name", name: "name", type: "text" },
      { label: "Authority record", name: "sameAs", type: "text" },
      {
        label: "Certainty",
        name: "certainty",
        type: "select",
        options: ["--Select--", "High", "Medium", "Low", "Unknown"],
      },
      {
        label: "Evidence",
        name: "evidence",
        type: "select",
        options: ["--Select--", "Internal", "External", "Conjecture"],
      },
    ]),
    place: createFormFields([
      { label: "Name", name: "name", type: "text" },
      { label: "Authority record", name: "sameAs", type: "text" },
      {
        label: "Certainty",
        name: "certainty",
        type: "select",
        options: ["--Select--", "High", "Medium", "Low", "Unknown"],
      },
      {
        label: "Evidence",
        name: "evidence",
        type: "select",
        options: ["--Select--", "Internal", "External", "Conjecture"],
      },
    ]),
    work: createFormFields([
      { label: "Title", name: "name", type: "text" },
      { label: "Authority record", name: "sameAs", type: "text" },
      {
        label: "Certainty",
        name: "certainty",
        type: "select",
        options: ["--Select--", "High", "Medium", "Low", "Unknown"],
      },
      {
        label: "Evidence",
        name: "evidence",
        type: "select",
        options: ["--Select--", "Internal", "External", "Conjecture"],
      },
    ]),
    organization: createFormFields([
      { label: "Name", name: "name", type: "text" },
      { label: "Authority record", name: "sameAs", type: "text" },
      {
        label: "Certainty",
        name: "certainty",
        type: "select",
        options: ["--Select--", "High", "Medium", "Low", "Unknown"],
      },
      {
        label: "Evidence",
        name: "evidence",
        type: "select",
        options: ["--Select--", "Internal", "External", "Conjecture"],
      },
    ]),
    date: createFormFields([
      { label: "When", name: "when", type: "date" },
      { label: "From", name: "from", type: "date" },
      { label: "To", name: "to", type: "date" },
      { label: "Not Before", name: "notBefore", type: "date" },
      { label: "Not After", name: "notAfter", type: "date" },
      { label: "Period", name: "period", type: "text" },
      { label: "Calendar", name: "calendar", type: "text" },
      {
        label: "Certainty",
        name: "certainty",
        type: "select",
        options: ["--Select--", "High", "Medium", "Low", "Unknown"],
      },
      {
        label: "Evidence",
        name: "evidence",
        type: "select",
        options: ["--Select--", "Internal", "External", "Conjecture"],
      },
    ]),
  };

  return formFieldTemplates[type] || createFormFields([
    { label: "Field 1", name: "field1", type: "text" },
    { label: "Field 2", name: "field2", type: "text" },
    {
      label: "Certainty",
      name: "certainty",
      type: "select",
      options: ["High", "Medium", "Low", "Unknown"],
    },
    {
      label: "Evidence",
      name: "evidence",
      type: "select",
      options: ["Internal", "External", "Conjecture"],
    },
  ]);
}



  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  content.addEventListener("keydown", function (event) {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
      var range = selection.getRangeAt(0);
      var container = range.commonAncestorContainer;
      if (container.nodeType === 3) {
        container = container.parentNode;
      }

      if (container.classList.contains("person") || 
          container.classList.contains("place") || 
          container.classList.contains("work") || 
          container.classList.contains("organization") || 
          container.classList.contains("date")) {
        event.preventDefault();
      }
    }
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // JavaScript code to save the document
  document.getElementById("saveButton").addEventListener("click", function () {
  // Get the content from the editable div
  var title = document.getElementById("documentTitle").textContent;
  var content = document.getElementById("editableContent").innerHTML;

  // Send the content to the server (e.g., via AJAX or Fetch)
  // Make sure to include CSRF protection if using Flask and AJAX.
  fetch("/save_document", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: title, content: content }),
  })
    .then(function (response) {
      if (response.ok) {
        // Document saved successfully
        alert("Document saved successfully!");
      } else {
        // Handle errors, if any
        alert("Error saving document. Please try again.");
      }
    })
    .catch(function (error) {
      alert("Error saving document. Please try again.");
    });
  });


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
    var title = document.querySelector("h1").innerText.trim(); // Assuming the title is inside an <h1> element

    // Get the document ID from the content area
    var documentId = document.querySelector("#editableContent").dataset.documentId;
    
    if (!documentId) {
      console.error("Document ID not provided");
      return;
    }

    fetch("/get_document/" + documentId)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch document");
        }
      })
      .then(function (data) {
        // Set the content and title based on the fetched data
        content = data.content;
        title = data.title;

        // Rest of your existing code for saving the document...
      })
      .catch(function (error) {
        console.error(error);
      });
  }

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


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  function populateSidePanel() {
    var spans = document.querySelectorAll(".entity");
    var peoplePanel = document.querySelector(".people-content .panel-blocks");
    var placesPanel = document.querySelector(".places-content .panel-blocks");
    var worksPanel = document.querySelector(".works-content .panel-blocks");
    var organizationsPanel = document.querySelector(".organizations-content .panel-blocks");
    var datesPanel = document.querySelector(".dates-content .panel-blocks");

    spans.forEach(function (span) {
      if (span.classList.contains("person")) {
        var value = span.textContent;
        var iconClass = "user";
        var tabClass = "people-content";
        var entityClass = span.classList[1];
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
        var entityClass = span.classList[1];
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
      var entityClass = span.classList[1];
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
      var entityClass = span.classList[1];
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
    var entityClass = span.classList[1];
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
};

  populateSidePanel(); 
        

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
      closeAllModals();
    }
  });

  // Additional click event listener for modal close buttons
  var modalCloseButtons = document.querySelectorAll(".modal-close");
  modalCloseButtons.forEach(function (closeButton) {
    closeButton.addEventListener("click", function () {
      closeAllModals();
    });
  });
});
