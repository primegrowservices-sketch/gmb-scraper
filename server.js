const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/api/leads", async (req, res) => {
  const keyword = req.query.keyword || "salon delhi";

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(`https://www.google.com/maps/search/${keyword}`);

    await page.waitForTimeout(5000);

    // Scroll for more results
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 10000);
      await page.waitForTimeout(3000);
    }

    const data = await page.evaluate(() => {
      const results = [];
      const items = document.querySelectorAll(".Nv2PK");

      items.forEach((el) => {
        const name = el.querySelector(".qBF1Pd")?.innerText;
        const phone = el.innerText.match(/\d{10}/)?.[0];

        if (name && phone) {
          results.push({ name, phone });
        }
      });

      return results;
    });

    await browser.close();

    res.json(data);
  } catch (err) {
    res.json({ error: "Scraping failed", details: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
