const path = require("path");
const fastText = require("fasttext");
const puppeteer = require("puppeteer");
const natural = require("natural");
const async = require("async");
const fs = require("fs");
// const brain = require("brain.js");
const tfnode = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");

const websitesToTest = require("./tests.json");

const modelFastText = path.resolve(
  __dirname,
  "../prepare-learn-data/fastext/model.bin"
);
const modelNb = path.resolve(__dirname, "../prepare-learn-data/nb/nb.json");
const modelLSTM = require(path.resolve(
  __dirname,
  "../prepare-learn-data/brain/lstm.json"
));
const classifierFt = new fastText.Classifier(modelFastText);
let modelTf;
// const neuralNetworkLSTM = new brain.recurrent.GRU({hiddenLayers:[40,10,4]});
// neuralNetworkLSTM.fromJSON(modelLSTM);

let classfierNb;
let browser;
let testsResults = [];

// get sites datas
(async () => {
  modelTf = await tfnode.loadLayersModel(
    `file://${path.resolve(
      __dirname,
      "../prepare-learn-data/tf/tf.model/model.json"
    )}`
  );
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
        console.log(testsResults[0]);
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
  let tfConvertedData = await use
    .load()
    .then((model) => {
      return model.embed(steemed)
    })
    .catch((err) => console.error("Fit Error:", err));
  // const preparedDataLSTM = processTestingData(steemed);
  // const lstmRes = neuralNetworkLSTM.run(preparedDataLSTM);
  const tensor = modelTf.predict(tfConvertedData);
  const tfVal = tensor.dataSync()[0];
  testsResults.push({ site: url, nb: nbres, fastext: ftres, tf: tfVal });
}

function encode(arg) {
  let arrEncoded = arg
    .split("")
    .map((x) => (x.charCodeAt(0) / 256 < 1 ? x.charCodeAt(0) / 256 : 0));
  if (arrEncoded.length < 40) {
    arrEncoded.fill(0, arrEncoded.length - 1, 39);
  }
  return arrEncoded;
}

function processTestingData(data) {
  let enc = encode(data.substring(0, 40));
  return enc;
}
