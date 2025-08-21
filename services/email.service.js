import transporter from "../utils/transporter.js";

export const sendEmailToCompany = async ({
  html,
  subject = "New Form Submission",
  to, // can be string OR array
}) => {
  const recipients = to;

  const mailOptions = {
    from: `"TimeWatch Contact Form" <${process.env.EMAIL_USER}>`,
    to: recipients, // nodemailer accepts string OR array
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendMessageToCustomer = async ({ name, email }) => {
  // console.log("template data", name, email)
  const mailOptions = {
    from: `"TimeWatch Infocom Pvt. Ltd." <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🙏 Thank You for Contacting Us!",
    html: `
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
      <br/>
      <p>Best regards,<br/>
      <strong>TimeWatch Infocom Pvt. Ltd.</strong></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
