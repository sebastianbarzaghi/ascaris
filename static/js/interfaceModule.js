const InterfaceModule = (function () {

    // Metadata functionalities
    const form = document.querySelector(".metadata-form");
    const accordionHeaders = document.querySelectorAll(".metadata-accordion-header");

    const addTitleButton = form.querySelector(".add-title-button");
    const addResponsibilityButton = form.querySelector(".add-responsibility-button");
    const addPubAuthorityButton = form.querySelector(".add-publication-authority-button");
    const addIdentifierButton = form.querySelector(".add-identifier-button");
    const addSourceButton = form.querySelector(".add-source-button");
    const addLangUsageButton = form.querySelector(".add-language-button");
    const addCategoryButton = form.querySelector(".add-category-button");

    const titleInputGroup = form.querySelector(".title-input-group");
    const responsibilitiesInputGroup = form.querySelector(".responsibility-input-group");
    const pubAuthoritiesInputGroup = form.querySelector(".publication-authority-input-group");
    const identifierInputGroup = form.querySelector(".identifier-input-group");
    const sourceInputGroup = form.querySelector(".source-input-group");
    const langUsageInputGroup = form.querySelector(".language-input-group");
    const categoryInputGroup = form.querySelector(".category-input-group");


    const additionalTitlesContainer = form.querySelector(".additional-titles");
    const additionalResponsibilitiesContainer = form.querySelector(".additional-responsibilities");
    const additionalPubAuthoritiesContainer = form.querySelector(".additional-publication-authorities");
    const additionalIdentifierContainer = form.querySelector(".additional-identifiers");
    const additionalSourceContainer = form.querySelector(".additional-sources");
    const additionalLangUsageContainer = form.querySelector(".additional-languages");
    const additionalCategoryContainer = form.querySelector(".additional-categories");

    accordionHeaders.forEach(accordionHeader => {
        accordionHeader.addEventListener("click", function () {
            const accordionContent = this.nextElementSibling;
            accordionContent.classList.toggle("is-hidden");
        });
    });

    addTitleButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-title-button")) {
            const clone = titleInputGroup.cloneNode(true);
            clone.querySelector(".metadata-title").value = "";
            const removeButton = document.createElement("span");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-title-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalTitlesContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-title-button").remove();
        }
    });

    addResponsibilityButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-responsibility-button")) {
            const clone = responsibilitiesInputGroup.cloneNode(true);
            clone.querySelector(".metadata-title-responsibility").value = "";
            const removeButton = document.createElement("span");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-responsibility-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalResponsibilitiesContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-responsibility-button").remove();
        }
    });

    addPubAuthorityButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-publication-authority-button")) {
            const clone = pubAuthoritiesInputGroup.cloneNode(true);
            clone.querySelector(".metadata-publication-authority").value = "";
            const removeButton = document.createElement("span");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-publication-authority-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalPubAuthoritiesContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-publication-authority-button").remove();
        }
    });

    addIdentifierButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-identifier-button")) {
            const clone = identifierInputGroup.cloneNode(true);
            clone.querySelector(".metadata-identifier").value = "";
            const removeButton = document.createElement("span");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-identifier-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalIdentifierContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-identifier-button").remove();
        }
    });

    addSourceButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-source-button")) {
            const clone = sourceInputGroup.cloneNode(true);
            clone.querySelector(".metadata-source").value = "";
            const removeButton = document.createElement("span");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-source-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalSourceContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-source-button").remove();
        }
    });

    addLangUsageButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-language-button")) {
            const clone = langUsageInputGroup.cloneNode(true);
            clone.querySelector(".metadata-language").value = "";
            const removeButton = document.createElement("span");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-language-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalLangUsageContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-language-button").remove();
        }
    });

    addCategoryButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-category-button")) {
            const clone = categoryInputGroup.cloneNode(true);
            clone.querySelector(".metadata-category").value = "";
            const removeButton = document.createElement("span");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-category-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalCategoryContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-category-button").remove();
        }
    });

    // Handle remove button click
    form.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-title-button")) {
            event.target.closest(".title-input-group").remove();
        }
        else if (event.target.classList.contains("remove-responsibility-button")) {
            event.target.closest(".responsibility-input-group").remove();
        }
        else if (event.target.classList.contains("remove-publication-authority-button")) {
            event.target.closest(".publication-authority-input-group").remove();
        }
        else if (event.target.classList.contains("remove-identifier-button")) {
            event.target.closest(".identifier-input-group").remove();
        }
        else if (event.target.classList.contains("remove-source-button")) {
            event.target.closest(".source-input-group").remove();
        }
        else if (event.target.classList.contains("remove-language-button")) {
            event.target.closest(".language-input-group").remove();
        }
        else if (event.target.classList.contains("remove-category-button")) {
            event.target.closest(".category-input-group").remove();
        }
    });

})();

export { InterfaceModule }
