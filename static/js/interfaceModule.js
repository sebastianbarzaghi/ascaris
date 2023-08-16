const InterfaceModule = (function () {

    // Metadata functionalities
    const form = document.querySelector(".metadata-form");
    const accordionHeaders = document.querySelectorAll(".metadata-accordion-header");

    const addTitleButton = form.querySelector(".add-title-button");
    const addResponsibilityButton = form.querySelector(".add-responsibility-button");
    const addPubAuthorityButton = form.querySelector(".add-publication-authority-button");
    const addIdentifierButton = form.querySelector(".add-identifier-button");
    const addExtentButton = form.querySelector(".add-extent-button");
    const addSourceButton = form.querySelector(".add-source-button");
    const addEditionRespButton = form.querySelector(".add-edition-responsibility-button");
    const addSeriesRespButton = form.querySelector(".add-series-responsibility-button");
    const addSeriesIdentButton = form.querySelector(".add-series-identifier-button");
    const addLangUsageButton = form.querySelector(".add-language-button");
    const addCalendarButton = form.querySelector(".add-calendar-button");
    const addActionButton = form.querySelector(".add-action-button");
    const addContextButton = form.querySelector(".add-context-button");

    const titleInputGroup = form.querySelector(".title-input-group");
    const responsibilitiesInputGroup = form.querySelector(".responsibility-input-group");
    const pubAuthoritiesInputGroup = form.querySelector(".publication-authority-input-group");
    const identifierInputGroup = form.querySelector(".identifier-input-group");
    const extentInputGroup = form.querySelector(".extent-input-group");
    const sourceInputGroup = form.querySelector(".source-input-group");
    const editionRespInputGroup = form.querySelector(".edition-responsibility-input-group");
    const seriesRespInputGroup = form.querySelector(".series-responsibility-input-group");
    const seriesIdentInputGroup = form.querySelector(".series-identifier-input-group");
    const langUsageInputGroup = form.querySelector(".language-input-group");
    const calendarInputGroup = form.querySelector(".calendar-input-group");
    const actionInputGroup = form.querySelector(".action-input-group");
    const contextInputGroup = form.querySelector(".calendar-input-group");

    const additionalTitlesContainer = form.querySelector(".additional-titles");
    const additionalResponsibilitiesContainer = form.querySelector(".additional-responsibilities");
    const additionalPubAuthoritiesContainer = form.querySelector(".additional-publication-authorities");
    const additionalIdentifierContainer = form.querySelector(".additional-identifiers");
    const additionalExtentContainer = form.querySelector(".additional-extents");
    const additionalSourceContainer = form.querySelector(".additional-sources");
    const additionalEditionRespContainer = form.querySelector(".additional-edition-responsibilities");
    const additionalSeriesRespContainer = form.querySelector(".additional-series-responsibilities");
    const additionalSeriesIdentContainer = form.querySelector(".additional-series-identifiers");
    const additionalLangUsageContainer = form.querySelector(".additional-languages");
    const additionalCalendarContainer = form.querySelector(".additional-calendars");
    const additionalActionContainer = form.querySelector(".additional-actions");
    const additionalContextContainer = form.querySelector(".additional-contexts");

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

    addExtentButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-extent-button")) {
            const clone = extentInputGroup.cloneNode(true);
            clone.querySelector(".metadata-extent").value = "";
            const removeButton = document.createElement("span");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-extent-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalExtentContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-extent-button").remove();
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

    addEditionRespButton.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-edition-responsibility-button")) {
            const clone = editionRespInputGroup.cloneNode(true);
            clone.querySelector(".metadata-edition-responsibility").value = "";
            const removeButton = document.createElement("span");
            removeButton.classList.add("button", "is-danger", "is-light", "remove-edition-responsibility-button");
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            clone.appendChild(removeButton);
            additionalEditionRespContainer.appendChild(clone);

            // Remove the add button from the added title
            clone.querySelector(".add-edition-responsibility-button").remove();
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
        else if (event.target.classList.contains("remove-extent-button")) {
            event.target.closest(".extent-input-group").remove();
        }
        else if (event.target.classList.contains("remove-source-button")) {
            event.target.closest(".source-input-group").remove();
        }
        else if (event.target.classList.contains("remove-edition-responsibility-button")) {
            event.target.closest(".edition-responsibility-input-group").remove();
        }
    });

})();

export { InterfaceModule }
