const puppeteer = require('puppeteer');
const https = require('https');

const tokenHanna = '2134912925:AAHAs9SxkYrlGDyOPdkYlu7swDwaALvW8mc';

const getData = async (url, coef = 0) => {

  let result = 'OK';

  if(url && url.match('https://www.ikea.com/ru/ru/')) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "domcontentloaded"});
    
    try {
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
    
      https.get(`https://api.telegram.org/bot${tokenHanna}/sendMessage?chat_id=-1001441630417&text=${data}`, (res) => {
        const { statusCode } = res;
        if(statusCode === 200) result = 'Something wrong with Telegram!'
      })
      .on("error", (err) => {
        result = "Error: " + err.message;
        console.log("Error_https_get: " + err.message);
      });
    } catch(e){
      result = e.message;
      console.log(e.message);
  }

    browser.close();

  } else result = 'No url or wrong website address!';
  return result;
};

module.exports = getData;
///////////////
//https.get(`https://api.telegram.org/bot${tokenHanna}/getMe`) // to find bot_id

// To find chat_id:
// https.get(`https://api.telegram.org/bot${tokenHanna}/getUpdates`, (res) => {
//   res.on('data', (d) => { console.log(JSON.parse(d).result[0]); });  
// }) 

// %0A - new string in TG

// Put data to storage buffer:
// require('child_process').spawn('clip').stdin.end(data, 'utf16le');

//  chat: { id: -602230664, title: 'TU'},
//  chat: { id: -1001441630417, title: 'ИКЕЯ малиновка'},