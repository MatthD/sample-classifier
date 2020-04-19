const natural = require("natural");
const landDetect = require("cld");
const fs = require("fs");
const path = require("path");
const async = require("async");

const tfnode = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");

// This will store prepared data
let preparedData = [];
let preparedTest = [];

const model = tfnode.sequential();

// Add layers to the model
model.add(
  tfnode.layers.dense({
    inputShape: [512],
    activation: "relu",
    units: 2,
  })
);

model.add(
  tfnode.layers.dense({
    inputShape: [2],
    activation: "sigmoid",
    units: 2,
  })
);

model.add(
  tfnode.layers.dense({
    inputShape: [2],
    activation: "sigmoid",
    units: 2,
  })
);

model.add(
  tfnode.layers.dense({
    inputShape: [2],
    activation: "sigmoid",
    units: 2,
  })
);

// Compile the model
model.compile({
  loss: "meanSquaredError",
  optimizer: tfnode.train.adam(0.06), // This is a standard compile config
});

async.parallel(
  [workOnSaas, workOnNoSaas, workOnNoSaasTest, workOnSaasTests],
  async function () {
    console.log(
      "finished loaded saas-nosaas👌",
      preparedData.length,
      preparedTest.length,
      preparedData[0],
      preparedTest[0]
    );
    await run(preparedData, preparedTest);
    model.save(`file://${path.resolve(__dirname, "tf/tf.model")}`);
    console.log("Finished TF train");
  }
);

async function run(sites, sites_testing) {
  return Promise.all([encodeData(sites), encodeData(sites_testing)])
    .then((data) => {
      console.log(
        "end encoding data",
        sites.length,
        sites_testing.length,
        Object.keys(data)
      );
      const { 0: training_data, 1: testing_data } = data;
      const outputData = tfnode.tensor2d(
        sites.map((data) => [
          data.intent,
          !!(data.intent),
        ])
      );
      return model
        .fit(training_data, outputData, { epochs: 20, verbose: 1 })
        // .then((history) => {
        //   model.predict(testing_data).print();
        // });
    })
    .catch((err) => console.log("Prom Err:", err));
}

function encodeData(data) {
  const sites = data.map((site) => site.text.toLowerCase());
  const trainingData = use
    .load()
    .then((model) => {
      return model.embed(sites);
    })
    .catch((err) => console.error("Fit Error:", err));

  return trainingData;
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
      files.slice(0, files.length - 150),
      6,
      readDetectLangLemAndInlineWords("SAAS", saasDataPath),
      cb
    );
  });
}
function workOnSaasTests(cb) {
  // For each files insides SAAS
  const saasDataPath = path.resolve(__dirname, "../crawl-websites/saas-data");
  fs.readdir(saasDataPath, function parseListSaas(err, files) {
    if (err) {
      console.error(err);
      return;
    }
    async.eachLimit(
      files.slice(Math.max(files.length - 150, 1)),
      6,
      readDetectLangLemAndInlineWords("SAAS", saasDataPath, true),
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
      files.slice(0, files.length - 150),
      6,
      readDetectLangLemAndInlineWords("NOSAAS", noSaasDataPath),
      cb
    );
  });
}

function workOnNoSaasTest(cb) {
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
      files.slice(Math.max(files.length - 150, 1)),
      6,
      readDetectLangLemAndInlineWords("NOSAAS", noSaasDataPath, true),
      cb
    );
  });
}

function readDetectLangLemAndInlineWords(type, path, test = false) {
  const intent = type === "SAAS" ? 1 : 0;
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
            stemmedValue = stemmedValue.replace(
              /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
              ""
            );
            stemmedValue = stemmedValue.replace(/\s\s+/gm, " ");
            if (!test) {
              preparedData.push({ text: stemmedValue, intent: intent });
            } else {
              preparedTest.push({ text: stemmedValue, intent: intent });
            }
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
