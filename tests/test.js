const path = require("path");
const fastText = require("fasttext");
const puppeteer = require("puppeteer");
const natural = require("natural");
const async = require("async");
const fs = require("fs");

const websitesToTest = require("./tests.json");

const modelFastText = path.resolve(
  __dirname,
  "../prepare-learn-data/fastext/model.bin"
);
const modelNb = path.resolve(__dirname, "../prepare-learn-data/nb/nb.json");
const classifierFt = new fastText.Classifier(modelFastText);
let classfierNb;
let browser;
let testsResults = [];

// get sites datas
(async () => {
  browser = await puppeteer.launch();
  natural.BayesClassifier.load(modelNb, null, function (err, classifier) {
    classfierNb = classifier;
    async.eachLimit(
      websitesToTest,
      4,
      checkSaasOrNot,
      async function allSiteTested(err, res) {
        console.log("All site had been tested 🎉", err, res);
        // await browser.close();
        fs.writeFileSync(
          path.resolve(__dirname, "./tests-results.json"),
          JSON.stringify(testsResults)
        );
        await browser.close();
      }
    );
  });
})();

async function checkSaasOrNot(url) {
  const page = await browser.newPage();
  await page.goto(url);
  await new Promise((r) => setTimeout(r, 4000));
  const notionText = await page.evaluate(() => document.body.innerText);
  await page.close();
  let steemed = natural.LancasterStemmer.stem(notionText);
  steemed = steemed.toLowerCase();
  steemed = steemed.replace(/(\r\n|\n|\r)/gm, " ");
  steemed = steemed.replace(/\s\s+/gm, " ");
  // console.log("steemed", steemed);
  const res = await classifierFt.predict(steemed, 5);
  let ftres;
  if (res.length > 0) {
    ftres = res;
  }
  let nbres = classfierNb.getClassifications(steemed);
  testsResults.push({ site: url, nb: nbres, fastext: ftres });
}
