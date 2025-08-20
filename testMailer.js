import transporter from "./utils/transporter.js";

async function test() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "v4vikram.dev@gmail.com", // your own email to test
      subject: "Test Mail",
      text: "Hello from new project",
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

test();
