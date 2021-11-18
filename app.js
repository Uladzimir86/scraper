const puppeteer = require('puppeteer');
const https = require('https');
const cors = require('cors');

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

const tokenHanna = '2134912925:AAHAs9SxkYrlGDyOPdkYlu7swDwaALvW8mc';
// const url = process.argv[2];
// const coef = 0.0365;

const getData = async (url, coef = 0) => {
  console.log(url, 'coef: ', coef)
  if(url && url.match('https://www.ikea.com/ru/ru/')) {
  const browser = await puppeteer.launch({
    // headless: false
  });
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: "domcontentloaded"});

  const title = await page.$eval('.range-revamp-aspect-ratio-image__image', (el) => {
    return (el?.alt || '--');
  });
  const img = await page.$eval('.range-revamp-aspect-ratio-image__image', (el) => {
    return (el?.src || '--');
  });
  const priceRu = await page.$eval('.range-revamp-price__integer', (el) => {
    return (el?.textContent || '--');
  });
  const priceBy = coef ? ` Цена BY: ${(Number(priceRu) * coef).toFixed(2)} бел. руб.` : '';

  const data = ` ${title.toUpperCase()}\r\n%0A Фото: ${img}\r\n%0A${priceBy} (Цена RU: ${priceRu} рус. руб.)\r\n%0A Ссылка на сайт: ${url} `;

  // put data to storage buffer
  // require('child_process').spawn('clip').stdin.end(data, 'utf16le');

  await browser.close();
  
  https.get(`https://api.telegram.org/bot${tokenHanna}/sendMessage?chat_id=-602230664&text=${data}`).on("error", (err) => {
  console.log("Error_https_get: " + err.message);
});
  } else console.log('no url, or wrong website address');
};

// https://www.ikea.com/ru/ru/p/songesand-songesand-karkas-krovati-s-2-yashchikami-belyy-lonset-s19241009/



//fetch(`https://api.telegram.org/bot${tokenHanna}/getMe`) // to find bot_id
//fetch(`https://api.telegram.org/bot${tokenHanna}/getUpdates`) // to find chat_id

// %0A - new string in TG

app.post('/', async (req, res) => {
  console.log((req.body))
  const {url, coef} = req.body;
  await getData(url, coef)
  res.send('ok')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})