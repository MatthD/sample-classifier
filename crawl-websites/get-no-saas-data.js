const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const async = require("async");
const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const writeFileAsync = promisify(fs.writeFile);

const listOfSaas = require("../listOfNoSassUrls.json");

const fileExists = async (path) =>
  !!(await fs.promises.stat(path).catch((e) => false));

let browser;

(async () => {
  browser = await puppeteer.launch();

  async.eachLimit(listOfSaas, 8, getSaasText, async function (err, res) {
    console.log("All site got text to files 😱", err);
    await browser.close();
  });
})();

async function getSaasText(saasUrl) {
  const pathToFile = path.resolve(__dirname, "no-saas-data", saasUrl);
  const exist = await fileExists(pathToFile);
  if (exist) return;
  try {
    const page = await browser.newPage();
    await page.goto(`http://${saasUrl}`);
    await new Promise((r) => setTimeout(r, 4000));
    const saasText = await page.evaluate(() => document.body.innerText);
    await writeFileAsync(
      path.resolve(__dirname, "no-saas-data", saasUrl),
      saasText,
      {
        encoding: "utf-8",
        flag: "w",
      }
    );
    console.log("did ", saasUrl);
    page.close();
    return saasUrl;
  } catch (err) {
    console.error(err);
    return err;
  }
}
