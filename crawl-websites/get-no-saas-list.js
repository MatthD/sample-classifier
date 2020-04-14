const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const async = require("async");
const fs = require("fs");

const noSaasList = [
  "https://www.alexa.com/topsites/category/Top/News",
  "https://www.alexa.com/topsites/category/Top/Games",
  "https://www.alexa.com/topsites/category/Top/Science",
  "https://www.alexa.com/topsites/category/Top/Kids_and_Teens",
  "https://www.alexa.com/topsites/category/Top/Recreation",
  "https://www.alexa.com/topsites/category/Top/Arts/Movies",
  "https://www.alexa.com/topsites/category/Top/Arts/Television",
  "https://www.alexa.com/topsites/category/Top/Sports",
  "https://www.alexa.com/topsites/category/Top/Shopping/Publications",
  "https://www.alexa.com/topsites/category/Top/Shopping/Publications/Comics",
  "https://www.alexa.com/topsites/category/Top/Shopping/Publications/Calendars",
  "https://www.alexa.com/topsites/category/Top/Shopping/Publications/Maps",
  "https://www.alexa.com/topsites/category/Top/Health/Animal",
  "https://www.alexa.com/topsites/category/Top/Health/Animal/Veterinary_Medicine",
  "https://www.alexa.com/topsites/category/Top/Kids_and_Teens/People_and_Society",
  "https://www.alexa.com/topsites/category/Top/Kids_and_Teens/People_and_Society/Genealogy",
  "https://www.alexa.com/topsites/category/Top/Shopping/Flowers",
  "https://www.alexa.com/topsites/category/Top/Shopping/Flowers/Artificial_and_Silk",
  "https://www.alexa.com/topsites/category/Top/Shopping/Toys_and_Games",
  "https://www.alexa.com/topsites/category/Top/Shopping/Toys_and_Games/Baby",
  "https://www.alexa.com/topsites/category/Top/Arts/Animation",
  "https://www.alexa.com/topsites/category/Top/Arts/Chats_and_Forums",
  "https://www.alexa.com/topsites/category/Top/Arts/Education",
  "https://www.alexa.com/topsites/category/Top/Arts/People",
  "https://www.alexa.com/topsites/category/Top/Computers/E-Books",
  "https://www.alexa.com/topsites/category/Top/Home/Personal_Finance",
  "https://www.alexa.com/topsites/category/Top/Home/Cooking",
  "https://www.alexa.com/topsites/category/Top/World/Français/Actualité",
  "https://www.alexa.com/topsites/category/Top/World/Français/Actualité/Télévision",
  "https://www.alexa.com/topsites/category/Top/World/Français/Boutiques_en_ligne",
  "https://www.alexa.com/topsites/category/Top/World/Français/Commerce_et_économie",
  "https://www.alexa.com/topsites/category/Top/World/Français/Enfants_et_ados",
  "https://www.alexa.com/topsites/category/Top/World/Français/Santé",
  "https://www.alexa.com/topsites/category/Top/World/Français/Jeux",
  "https://www.alexa.com/topsites/category/Top/World/Français/Références",
  "https://www.alexa.com/topsites/category/Top/World/Français/Sciences",
  "https://www.alexa.com/topsites/category/Top/World/Français/Sports",
];
var listOfUrls = [];

async.eachLimit(noSaasList, 3, getNoSaasUrl, function (err, res) {
  console.log("Got all sass urls 👍");
  fs.writeFileSync("listOfNoSassUrls.json", JSON.stringify(listOfUrls), {
    encoding: "utf-8",
  });
});

async function getNoSaasUrl(pageUrl, next) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl);
    await new Promise((r) => setTimeout(r, 4000));
    const html = await page.content();
    const $ = cheerio.load(html);
    let urls = $(".tableContainer .DescriptionCell a");
    urls.each((i, url) => {
      listOfUrls.push($(url).text());
    });
    await browser.close();
  } catch (err) {
    console.error(err);
    next();
  }
}
