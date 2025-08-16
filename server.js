import app from "./app.js";

const PORT = process.env.SERVER || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
