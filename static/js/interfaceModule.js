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
                const titleLang = document.querySelector('#title-language');
                const titleType = document.querySelector('#title-type');
                const titleLevel = document.querySelector('#title-level');
                titleInput.value = data.title[0].text;
                for (const option of titleLang.options) {
                    if (option.value === data.title[0].lang) {
                        option.selected = true;
                        break;
                    }
                }
                for (const option of titleType.options) {
                    if (option.value === data.title[0].type) {
                        option.selected = true;
                        break;
                    }
                }
                for (const option of titleLevel.options) {
                    if (option.value === data.title[0].level) {
                        option.selected = true;
                        break;
                    }
                }

                const respSurname = document.querySelector('#resp-surname');
                const respName = document.querySelector('#resp-name');
                const respAuthority = document.querySelector('#resp-authority');
                const respRole = document.querySelector('#resp-role');
                respSurname.value = data.resp[0].surname;
                respName.value = data.resp[0].name;
                respAuthority.value = data.resp[0].authority;
                for (const option of respRole.options) {
                    if (option.value === data.resp[0].role) {
                        option.selected = true;
                        break;
                    }
                }

                //pubauthority

                const pubPlaceName = document.querySelector('#pubPlace-name');
                const pubPlaceAuthority = document.querySelector('#pubPlace-authority');
                pubPlaceName.value = data.pubPlace[0].name;
                pubPlaceAuthority.value = data.pubPlace[0].authority;

                //pubdate

                const identText = document.querySelector('#identifier-text');
                const identType = document.querySelector('#identifier-type');
                identText.value = data.ident[0].text;
                for (const option of identType.options) {
                    if (option.value === data.ident[0].type) {
                        option.selected = true;
                        break;
                    }
                }

                const descText = document.querySelector('#description-text');
                descText.value = data.desc[0].text;


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
    fetchExistingDataAndPopulate(documentId, "resp");
    fetchExistingDataAndPopulate(documentId, "pubPlace");

})();

export { InterfaceModule }
