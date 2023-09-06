const FormFieldsModule = (function () {
  
  function createFormFieldTemplates(type) {
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
          } else if (field.type === "textarea") {
            return `
            <div class="field">
            <label class="label">${field.label}</label>
            <div class="control">
              <textarea class="textarea" name="${field.name}" placeholder="Enter ${field.label.toLowerCase()}"></textarea>
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
              .map((option) => `<option value="${option.toLowerCase()}">${option}</option>`)
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
    };

    const formFieldTemplates = {
      person: createFormFields([
        { 
          label: "Name", 
          name: "name", 
          type: "text" 
        },
        { 
          label: "Authority record", 
          name: "sameAs", 
          type: "text" 
        },
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
        { 
          label: "Note", 
          name: "note", 
          type: "textarea" 
        },
      ]),
      place: createFormFields([
        { 
          label: "Name", 
          name: "name", 
          type: "text" 
        },
        { 
          label: "Authority record", 
          name: "sameAs", 
          type: "text" 
        },
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
        { 
          label: "Note", 
          name: "note", 
          type: "textarea" 
        },
      ]),
      work: createFormFields([
        { 
          label: "Title", 
          name: "name", 
          type: "text" 
        },
        { 
          label: "Authority record", 
          name: "sameAs", 
          type: "text" 
        },
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
        { 
          label: "Note", 
          name: "note", 
          type: "textarea" 
        },
      ]),
      organization: createFormFields([
        { 
          label: "Name", 
          name: "name", 
          type: "text" 
        },
        { 
          label: "Authority record", 
          name: "sameAs", 
          type: "text" 
        },
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
        { 
          label: "Note", 
          name: "note", 
          type: "textarea" 
        },
      ]),
      date: createFormFields([
        { 
          label: "When", 
          name: "when", 
          type: "date" 
        },
        { 
          label: "From", 
          name: "from", 
          type: "date" 
        },
        { 
          label: "To", 
          name: "to", 
          type: "date" 
        },
        { 
          label: "Not Before", 
          name: "notBefore", 
          type: "date" 
        },
        { 
          label: "Not After", 
          name: "notAfter", 
          type: "date" 
        },
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
        { label: "Note", 
          name: "note", 
          type: "textarea" 
        },
      ]),
    };

    return formFieldTemplates[type]

  };
  return {
    createFormFieldTemplates
  };
})();

export { FormFieldsModule };