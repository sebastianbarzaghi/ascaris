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
      var value = target.getAttribute("data-value");
      var tabClass = target.classList[0] + "-content";
      var panelBlock = createPanelBlock(
        target.classList[0] + "-block",
        "user",
        value
      );

      var panelBlocks = document.querySelector("." + tabClass + "-blocks");
      panelBlocks.appendChild(panelBlock);
    }
  });

  // Function to create a panel block element
  function createPanelBlock(blockClass, iconClass, value, tabClass) {
    var block = document.createElement("a");
    block.classList.add("panel-block", blockClass);
    block.setAttribute("draggable", "true");
    block.setAttribute("data-value", value);

    var icon = document.createElement("span");
    icon.classList.add("panel-icon");
    icon.innerHTML = '<i class="fas fa-' + iconClass + '"></i>';

    var text = document.createElement("span");
    text.textContent = value;

    block.appendChild(icon);
    block.appendChild(text);

    // Add a click event listener to the panel block to remove it on click
    /*
    block.addEventListener("click", function () {
      var value = block.getAttribute("data-value");
      var spans = document.querySelectorAll('span[data-value="' + value + '"]');
      spans.forEach(function (span) {
        var parent = span.parentNode;
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
      });
      block.parentNode.removeChild(block);
    });
    */

    // Add a class to the panel block corresponding to the tab
    block.classList.add(tabClass);

    return block;
  }

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

});
