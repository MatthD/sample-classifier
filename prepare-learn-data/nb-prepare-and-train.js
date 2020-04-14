const natural = require("natural");
const classifierNb = new natural.BayesClassifier();
const landDetect = require("cld");
const fs = require("fs");
const path = require("path");
const async = require("async");

async.parallel([workOnSaas, workOnNoSaas], function () {
  console.log("finished saas-nosaas👌");
  classifierNb.train();
  classifierNb.save(path.resolve(__dirname, "nb/nb.json"), function () {
    console.log("Model NB saved 👌");
  });
});

function workOnSaas(cb) {
  // For each files insides SAAS
  const saasDataPath = path.resolve(__dirname, "../crawl-websites/saas-data");
  fs.readdir(saasDataPath, function parseListSaas(err, files) {
    if (err) {
      console.error(err);
      return;
    }
    async.eachLimit(
      files,
      6,
      readDetectLangLemAndInlineWordsAndTrain("SAAS", saasDataPath),
      cb
    );
  });
}

function workOnNoSaas(cb) {
  // For each files insides NOSAAS
  const noSaasDataPath = path.resolve(
    __dirname,
    "../crawl-websites/no-saas-data"
  );
  fs.readdir(noSaasDataPath, function parseListSaas(err, files) {
    if (err) {
      console.error(err);
      return;
    }
    async.eachLimit(
      files,
      6,
      readDetectLangLemAndInlineWordsAndTrain("NOSAAS", noSaasDataPath),
      cb
    );
  });
}

function readDetectLangLemAndInlineWordsAndTrain(type, path) {
  return function (filePath, next) {
    // console.log(type);
    fs.readFile(
      `${path}/${filePath}`,
      {
        encoding: "utf-8",
      },
      function detect(err, fileData) {
        if (err) return next();
        landDetect.detect(fileData, function stemmAndTrain(err, fileLang) {
          if (err) return next();
          let stemmedValue;
          try {
            if (fileLang.languages[0].code === "fr") {
              stemmedValue = natural.PorterStemmerFr.stem(fileData);
            } else {
              stemmedValue = natural.LancasterStemmer.stem(fileData);
            }
            stemmedValue = stemmedValue.toLowerCase();
            stemmedValue = stemmedValue.replace(/(\r\n|\n|\r)/gm, " ");
            stemmedValue = stemmedValue.replace(/\s\s+/gm, " ");
            classifierNb.addDocument(stemmedValue, type);
            console.log("Did ", filePath);
            next();
          } catch (err) {
            console.error("err", err);
            next();
          }
        });
      }
    );
  };
}
