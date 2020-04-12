const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const async = require("async");
const fs = require("fs");

var saasPage = 1;
var maxSaasPage = 56;
const saasList = `https://www.saasmag.com/saas-1000-2019`;
var listOfUrls = [];

async.timesLimit(maxSaasPage, 5, getSaasUrl, function (err, res) {
  console.log("Got all sass urls 👍");
  fs.writeFileSync("listOfSassUrls.json", JSON.stringify(listOfUrls), {
    encoding: "utf-8",
  });
});

async function getSaasUrl(pageNb, next) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${saasList}/${pageNb}`);
    await new Promise((r) => setTimeout(r, 4000));
    const html = await page.content();
    const $ = cheerio.load(html);
    let urls = $("#companyDataGrid tbody td a:nth-child(2)");
    const pathUrls = urls.map((i, url) => {
      return url.attribs.href;
    });
    pathUrls.each((i, url) => {
      listOfUrls.push(extractUrlFromString(url));
    });
    await browser.close();
  } catch (err) {
    console.error(err);
    next();
  }
  // let res = await request({ uri: saasList })
  //   .then(function parseHTMLTable(htmlSaas) {
  //     console.log(urls.text());
  //     return urls;
  //   })
  //   .catch(console.error);
}

function extractUrlFromString(url) {
  return url.split("/profile/")[1];
}
