const brain = require("brain.js");
const natural = require("natural");
const landDetect = require("cld");
const fs = require("fs");
const path = require("path");
const async = require("async");

let trainedNet;
let preparedData = [];
// train(trainingData);

async.parallel([workOnSaas, workOnNoSaas], function () {
  console.log("finished saas-nosaas👌");
  const preparedForTrainingData = processTrainingData(preparedData);
  console.log('Processed data... selecting subelements')
  const datasSaas = preparedForTrainingData.filter(el=>{
    return el.output.SAAS === 1
  }).slice(150);
  const datasNoSaas = preparedForTrainingData.filter(el=>el.output.NOSAAS === 1).slice(150);
  train([...datasSaas, ...datasNoSaas]);  
  fs.writeFileSync(path.resolve(__dirname, 'brain/gru.json'), JSON.stringify(trainedNet), {encoding: 'utf-8'})
  console.log('Finished train');
});

/**
 *
 * HELPERS
 */

function encode(arg) {
  let arrEncoded = arg.split("").map((x) => (x.charCodeAt(0) / 256 < 1)  ? x.charCodeAt(0) / 256 : 0);
  if(arrEncoded.length < 40){
    arrEncoded.fill(0, arrEncoded.length-1, 39)
  }
  return arrEncoded;
}

function processTrainingData(data) {
  return data.map((d) => {
    return {
      input: encode(d.input.substring(0,40)),
      output: d.output,
    };
  });
}

function train(data) {
  let net = new brain.recurrent.GRU({hiddenLayers:[40,10,4]});
  net.train(data, {
    // Defaults values --> expected validation
    iterations: 1000, // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.2, // the acceptable error percentage from training data --> number between 0 and 1
    log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 1, // iterations between logging out --> number greater than 0
    learningRate: 0.05, // scales with delta to effect training rate --> number between 0 and 1
    momentum: 0.01, // scales with next layer's change value --> number between 0 and 1
    callback: null, // a periodic call back that can be triggered while training --> null or function
    callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
    timeout: Infinity, // the max number of milliseconds to train for --> number greater than 0
  });
  trainedNet = net.toJSON();
}

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
            stemmedValue = stemmedValue.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
            stemmedValue = stemmedValue.replace(/\s\s+/gm, " ");
            preparedData.push({input: stemmedValue, output: {[type]: 1}})
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