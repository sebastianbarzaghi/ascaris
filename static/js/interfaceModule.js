const InterfaceModule = (function () {

    // Metadata functionalities
    const content = document.querySelector(".content");
    const documentId = content.getAttribute("data-documentId");
    const form = document.querySelector(".metadata-form");
    const accordionHeaders = document.querySelectorAll(".metadata-accordion-header");
    const fieldCounters = {};
    
    accordionHeaders.forEach(accordionHeader => {
        accordionHeader.addEventListener("click", function () {
            const accordionContent = this.nextElementSibling;
            accordionContent.classList.toggle("is-hidden");
        });
    });

    function handleAddButtonClick(field) {
        return function (event) {
            const inputGroup = document.querySelector(`.${field}-input-group`);
            const additionalContainer = document.querySelector(`.additional-${field}`);

            if (!fieldCounters[field]) {
                fieldCounters[field] = 1;
            } else {
                fieldCounters[field]++;
            }

            if (event.target.classList.contains(`add-${field}-button`)) {
                const clone = inputGroup.cloneNode(true);
                const origId = inputGroup.querySelector(`.metadata-${field}`).id;
                const origName = inputGroup.querySelector(`.metadata-${field}`).name;
                const currentCounter = fieldCounters[field];
                clone.querySelector(`.metadata-${field}`).value = "";
                clone.querySelectorAll(`.metadata-${field}`).forEach(input => {
                    input.id = `${origId}-${currentCounter}`;
                    input.name = `${origName}-${currentCounter}`;
                });
                const removeButton = document.createElement("span");
                removeButton.classList.add("button", "is-danger", "is-light", `remove-${field}-button`);
                const minusIcon = document.createElement("i");
                minusIcon.classList.add("fa-solid", "fa-minus");
                removeButton.appendChild(minusIcon);
                clone.appendChild(removeButton);
                additionalContainer.appendChild(clone);
                clone.querySelector(`.add-${field}-button`).remove();
            }
        };
    }

    function handleRemoveButtonClick(field) {
        return function (event) {
            const removeButton = event.target;
            if (removeButton.classList.contains(`remove-${field}-button`)) {
                const inputGroup = removeButton.closest(`.${field}-input-group`);
                inputGroup.remove();
                if (fieldCounters[field]) {
                    fieldCounters[field]--;
                }
            }
        };
    }

    function populateAdditionalFields(fieldType, existingData) {
        const additionalContainer = document.querySelector(`.additional-${fieldType}`);
        
        existingData.forEach(data => {
            const clone = additionalContainer.querySelector(`.${fieldType}-input-group`).cloneNode(true);
            // Populate the clone with data from the existing record
            clone.querySelector(`.metadata-${fieldType}`).value = data.text;
            additionalContainer.appendChild(clone);
        });
    }
    
    
    function fetchExistingDataAndPopulate(documentId, fieldType) {
        fetch(`/get_existing_data/${documentId}/${fieldType}`)
            .then(response => response.json())
            .then(data => {
                // Populate main form fields with existing data
                const titleInput = document.querySelector('#title-text');
                titleInput.value = data[0];
                // Populate other main form fields similarly
    
                // Populate additional fields
                //populateAdditionalFields('title', data.titles);
                //populateAdditionalFields('responsibility', data.responsibilities);
                // ... Populate other additional fields similarly
            });
    }
    
    
    function initializeAddButtons(field) {
        const addButtons = form.querySelectorAll(`.add-${field}-button`);
        addButtons.forEach(addButton => {
            addButton.addEventListener("click", handleAddButtonClick(field));
        });
    }

    function initializeRemoveButtons(field) {
        form.addEventListener("click", handleRemoveButtonClick(field));
    }

    initializeAddButtons("title");
    initializeAddButtons("responsibility");
    initializeAddButtons("pubAuthority");
    initializeAddButtons("identifier");
    initializeAddButtons("source");
    initializeAddButtons("language");
    initializeAddButtons("category");

    initializeRemoveButtons("title");
    initializeRemoveButtons("responsibility");
    initializeRemoveButtons("pubAuthority");
    initializeRemoveButtons("identifier");
    initializeRemoveButtons("source");
    initializeRemoveButtons("language");
    initializeRemoveButtons("category");

    fetchExistingDataAndPopulate(documentId, "title");

})();

export { InterfaceModule }
