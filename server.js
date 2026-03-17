const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("API Working ✅");
});

app.get("/api/leads", async (req, res) => {
  const keyword = req.query.keyword;

  // Fake dynamic logic (next step me real scraping)
  let results = [];

  for (let i = 1; i <= 10; i++) {
    results.push({
      name: keyword + " Business " + i,
      phone: "9" + Math.floor(100000000 + Math.random() * 900000000)
    });
  }

  res.json(results);
});

app.listen(3000, () => console.log("Server running on port 3000"));
