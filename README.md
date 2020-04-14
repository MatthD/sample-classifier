# sample-classifier

Sample classifier for website categories + sass/non-saas

## Requirements

_Node === 8_

## Install

`npm install`

## Prepare models

### Nayve bayse

`node prepare-learn-data/nb-prepare-and-train.js` will generate `prepare-learn-data/nb/nb.json`

### Fastext

`node prepare-learn-data/fastext-prepare.js` will generate `prepare-learn-data/fastext/model.bin` & `prepare-learn-data/fastext/model.vec`

## Launch tests

`node tests/test.js --nb --ft`

## View results

npx http-server tests -p 80

#### Add site data before building model

Site data are getting via scrapping, simply add your saas url inside `listOfSassUrls.json` and your _not-saas_ inside `listOfNoSassUrls.json`

You can surely re-use the scraper use to download multiple saas url from amazon & saas1000, checkout the `crawl-websites` folder

Then redo a `node crawl-websites/get-no-saas-data.js` & `node crawl-websites/get-saas-data.js`
