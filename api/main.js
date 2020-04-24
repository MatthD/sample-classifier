const express = require('express');
const bodyParser = require('body-parser')
const { Client } = require('pg');
const natural = require("natural");
const fastText = require("fasttext");
const path = require("path");
const kuler = require("kuler");
const fs = require("fs");
const cors = require('cors')
const modelFastText = path.resolve(
  __dirname,
  "../prepare-learn-data/fastext/model.bin"
);
const modelNN = path.resolve(
  __dirname,
  "datas/fastext-nn.bin"
);
const client = new Client({host: '127.0.0.1', port: 5432, database: 'prisma', user: 'prisma', password: 'prisma'})
client.connect();
const classifierFt = new fastText.Classifier(modelFastText);


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

const PORT_NB = 3000;
const sucessMessage = 'Hello station team';

// Main endpoint of the api
app.get('/', function mainEndpoint(req, res) {
  res.json({ message: sucessMessage });
});

app.post('/predictsaas', async function mainEndpoint(req, res) {
  const text = req.body.text;
  const url = req.body.url;
  const pathArray = url.split( '/' );
  const host = pathArray[2];

  // check if url is in db already
  const isAlreadyInDb = await checkIfUrlisPresent(host);
  if(isAlreadyInDb && isAlreadyInDb.rows[0] && isAlreadyInDb.rows[0].id){
    return res.json({message: 'already in our db as saas 🚀'});
  }
  console.log(`potential new saas detected.. will check ${host}`)
  const propreText = filterAndEncodeData(text);
  // predict from fastext 
  const result = await classifierFt.predict(propreText, 5);
  if(result[0].label === '__label__SAAS' && result[0].value >.5){
    console.log(kuler(`${host} seems at ${(result[0].value*100).toFixed(2)}% to be a SaaS 🎉 `, '#0DF926'))
    await insertInDb(host);
    addDataForFastText(propreText);
  }else{
    console.log(kuler(`${host} seems at ${(result[0].value*100).toFixed(2)}% to NOT be a SaaS  😟 `, '#F9370D'))
  }
  // send back data
  res.json({ predict: result[0].label, value: result[0].value });
});

app.listen(PORT_NB, async function startApi() {
  console.log(kuler(`🚀 Reforged api started at http://localhost:${PORT_NB}`, '#0D98F9'));
});

async function checkIfUrlisPresent(url){
  return client.query('SELECT * FROM "default$default"."Application" WHERE "company" = \'1\' AND "startUrl"::TEXT LIKE $1', [`%${url}%`])
}

async function insertInDb(host){
  try{
    const appId = Date.now();
    const newApp = await client.query('INSERT INTO "default$default"."Application" ("id", "name", "iconUrl", "startUrl", "isSinglePage", "createdAt", "updatedAt", "category", "company") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [appId, host , `https://www.google.com/s2/favicons?domain=${host}`, `http://${host}`, 'f', 'NOW()', 'NOW()', '4b29c1c47861d049fbd71bb6', '1'])
    const newUserHasApp = await client.query('INSERT INTO "default$default"."UserHasApplication" ("id", "navigationCount", "navigationLast", "createdAt", "updatedAt", "application", "user") VALUES ($1, $2, $3, $4, $5, $6, $7)', [Date.now(), '10', 'NOW()', 'NOW()', 'NOW()', appId, '203132']);
  }catch(err){
    console.error(err)
  }
}

function filterAndEncodeData(text){
  let steemed = natural.LancasterStemmer.stem(text);
  steemed = steemed.toLowerCase();
  steemed = steemed.replace(/(\r\n|\n|\r)/gm, " ");
  steemed = steemed.replace(/\s\s+/gm, " ");
  return steemed;
}

async function addDataForFastText(text){
  fs.appendFile(path.resolve(__dirname, `datas/fastext-nn.txt`), `${text}\r\n`, {encoding: 'utf-8'}, function(){
    return null;
  })
}