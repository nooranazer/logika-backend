import express from "express";

const app = express();
const PORT = 8000;

app.get("/test", (req, res) => {
  console.log("✅ /test route hit");
  res.send("Test route works");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
