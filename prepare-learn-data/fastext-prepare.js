const natural = require("natural");
const landDetect = require("cld");
const fs = require("fs");
const path = require("path");
const async = require("async");

const fastextDatas = fs.createWriteStream(
  path.resolve(__dirname, "fastext/fastext-data.txt"),
  { encoding: "utf-8", flags: "a" }
);

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
    readDetectLangLemAndInlineWords("SAAS", saasDataPath),
    function end(err, res) {
      console.log(err, res);
    }
  );
});

// For each files insides SAAS
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
    readDetectLangLemAndInlineWords("NOSAAS", noSaasDataPath),
    function end(err, res) {
      console.log(err, res);
    }
  );
});

function readDetectLangLemAndInlineWords(type, path) {
  return function (filePath, next) {
    // console.log(type);
    fs.readFile(
      `${path}/${filePath}`,
      {
        encoding: "utf-8",
      },
      function detect(err, fileData) {
        if (err) return next();
        landDetect.detect(fileData, function (err, fileLang) {
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
            fastextDatas.write(`\n__label__${type} ${stemmedValue}`, next);
          } catch (err) {
            console.error("err", err);
            next();
          }
        });
      }
    );
  };
}
