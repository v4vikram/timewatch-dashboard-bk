export const botReply = (text) => {
  const t = text.toLowerCase();

  if (t.includes("product") || t.includes("buy")) {
    return "Great! Tell me which product you’re interested in, and I’ll share pricing & features.";
  }
  if (t.includes("support")) {
    return "I can help with support. What issue are you facing?";
  }
  if (t.includes("callback") || t.includes("call back")) {
    return "Please share your name and phone number. Our team will call you shortly.";
  }
  // quick reply buttons
  if (t.includes("product info (buy)")) return botReply("product");
  if (t.includes("chat for support")) return botReply("support");
  if (t.includes("request a callback")) return botReply("callback");

  return "I didn’t fully get that. You can choose: Product Info (Buy), Chat for Support, or Request a Callback.";
};
