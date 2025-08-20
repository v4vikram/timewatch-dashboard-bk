// utils/emailTemplate.js
export const generateEmailHTML = (formData, title = "New Form Submission") => {
  let html = `<h2>${title}</h2>`;

  Object.entries(formData).forEach(([key, value]) => {
    // console.log("key", key)
    if (value && value !== "") {
      html += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</p>`;
    }
  });

  return html;
};
