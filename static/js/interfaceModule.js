const InterfaceModule = (function () {

    // Button functionalities

    function handleAddButtonClick(field, subfields) {
        return function(event) {
            const documentId = document.querySelector('.content')
            const documentIdValue = documentId.getAttribute('data-documentId')

            const addButton = event.target;
            const inputGroup = addButton.closest(`.${field}-input-group`);
            const container = addButton.closest('.container');
            const clone = inputGroup.cloneNode(true);
            
            let data = {};
            data['document_id'] = documentIdValue;
            
            subfields.forEach((subfield) => {
                const input = clone.querySelector(`[name="${field}-${subfield}"`);
                input.value = "";
                data[subfield] = input.value;
            });
            
            clone.removeAttribute("data-id");
            let hiddenDivs = clone.querySelectorAll('.hidden');
            hiddenDivs.forEach((hiddenDiv) => {
                hiddenDiv.classList.remove('hidden');
            })

            const removeButton = document.createElement("span");
            removeButton.classList.add("button", "is-danger", "is-light", `remove-${field}-button`);
            const minusIcon = document.createElement("i");
            minusIcon.classList.add("fa-solid", "fa-minus");
            removeButton.appendChild(minusIcon);
            removeButton.addEventListener("click", handleRemoveButtonClick(field, clone));
            const row = clone.querySelector('.row');
            row.appendChild(removeButton);
            container.appendChild(clone);
            clone.querySelector(`.add-${field}-button`).remove();

            fetch(`/${field}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then((response) => {
                console.log(data)
                if (response.ok) {
                    console.log('Addition succeeded')
                    
                } else {
                    console.log('Response Status:', response.status);
                    console.log('Response Status Text:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            
        };
    }

    function handleRemoveButtonClick(field) {
        return function (event) {
            const removeButton = event.target;
            const inputGroup = removeButton.closest(`.${field}-input-group`);
            if (removeButton.classList.contains(`remove-${field}-button`)) {
                const fieldId = inputGroup.getAttribute('data-id');
                if (!fieldId) {
                    inputGroup.remove();
                } else {
                    fetch(`/${field}/${fieldId}`, {
                        method: 'DELETE',
                    })
                    .then((response) => {
                        if (response.ok) {
                            inputGroup.remove();
                        } else {
                            console.error('Deletion failed');
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                }
            }
        };
    }
    
    
    function initializeRemoveButtons(field) {
        const removeButtons = document.querySelectorAll(`.remove-${field}-button`);
        removeButtons.forEach((removeButton) => {
            removeButton.addEventListener("click", handleRemoveButtonClick(field));
        })
    }
    
    
    function initializeAddButtons(field, subfields) {
        const addButtons = document.querySelectorAll(`.add-${field}-button`);
        addButtons.forEach(addButton => {
            addButton.addEventListener("click", handleAddButtonClick(field, subfields));
        });
    }


    initializeAddButtons("title", ["text", "language"]);
    initializeAddButtons("responsibility", ["surname", "name", "authority", "role"]);
    initializeAddButtons("pubAuthority", ["name", "authority", "role"]);
    initializeAddButtons("identifier", ["text", "type"]);
    initializeAddButtons("source", ['text']);
    initializeAddButtons("note", ['text']);
    initializeAddButtons("category", ["type"]);
    initializeAddButtons("abstract", ["text"]);

    initializeRemoveButtons("title");
    initializeRemoveButtons("responsibility");
    initializeRemoveButtons("pubAuthority");
    initializeRemoveButtons("identifier");
    initializeRemoveButtons("source");
    initializeRemoveButtons("note");
    initializeRemoveButtons("category");
    initializeRemoveButtons("abstract");

    function saveMetadata() {
        const documentId = document.querySelector('.content')
        const documentIdValue = documentId.getAttribute('data-documentId')
        const formData = {}; // Create an object to store the form data

        // Loop through all input and select elements
        const form = document.querySelector('.metadata-form')
        const containers = form.querySelectorAll('.container')
        containers.forEach((container) => {
            const containerType = container.getAttribute('data-type')
            const containerList = []
            const inputGroups = container.querySelectorAll('.input-group')
            inputGroups.forEach((inputGroup) => {
                const inputGroupObject = {}
                inputGroup.querySelectorAll('input, select, textarea').forEach((element) => {
                    const splitName = element.name.split('-');
                    const name = splitName[splitName.length - 1];
                    let value = element.value;
                    if(name === 'date') {
                        value = new Date(value);
                    }
                    inputGroupObject[name] = value;
                })
                containerList.push(inputGroupObject);
            })
            if (containerList.length > 1) {
                containerList.shift();
            }
            formData[containerType] = containerList;
        })

        // Send a PUT request to update the metadata
        fetch(`/metadata/${documentIdValue}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Send the data as JSON
            })
            .then((response) => {
                console.log(JSON.stringify(formData))
                if (response.ok) {
                    console.log('Metadata updated successfully');
                    // Handle success, e.g., show a success message
                } else {
                    console.error('Failed to update metadata');
                    // Handle failure, e.g., show an error message
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        
    }

// Attach a click event listener to the "Save" button
const saveButton = document.getElementById('save-metadata-button');
const form = document.querySelector('.metadata-form')
form.addEventListener('submit', (event) => {
    event.preventDefault()
})
if (saveButton) {
    saveButton.addEventListener('click', saveMetadata);
}


})();

export { InterfaceModule }
