const express = require("express");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const { Parser } = require("json2csv");

const app = express();

app.get("/", (req, res) => {
  res.send("GMB Scraper Running 🚀");
});

app.get("/download", async (req, res) => {
  const keyword = req.query.keyword || "salon delhi";

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(`https://www.google.com/maps/search/${keyword}`);

    await page.waitForTimeout(5000);

    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 10000);
      await page.waitForTimeout(2000);
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

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("leads.csv");
    res.send(csv);

  } catch (err) {
    res.send("Error: " + err.message);
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
