const puppeteer = require('puppeteer');
const https = require('https');

const tokenHanna = '2134912925:AAHAs9SxkYrlGDyOPdkYlu7swDwaALvW8mc';

const getData = async (url, coef = 0, site) => {

  let urlCheck = '';
  let titleSelector = '';
  let imgSelector = '';
  let priceSelector = '';
  let chatId = '';

  let result = 'OK! You are the best!';
  switch (site) {
    case 'IKEA': 
      urlCheck = 'https://www.ikea.com/ru/ru/';
      titleSelector = '.range-revamp-aspect-ratio-image__image';
      imgSelector = '.range-revamp-aspect-ratio-image__image';
      priceSelector = '.range-revamp-pip-price-package__main-price .range-revamp-price__integer';
      chatId = '-1001441630417';
      break;
    case 'SIMA-LAND': 
      urlCheck = 'https://www.sima-land.ru/';
      titleSelector = 'h1[data-testid="product-name"]';
      imgSelector = '.oxC1a';
      priceSelector = 'span[data-testid="cart-control:price"]';
      chatId = '-1001465270771';
      break;
    default: break;
  }

  if(url && url.match(urlCheck)) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "domcontentloaded"});
    
    try {
      let title = '--';
      if (site === 'IKEA') {
        title = await page.$eval(titleSelector, (el) => {
          return (el?.alt || '--');
        });
      } else if (site === 'SIMA-LAND') {
        title = await page.$eval(titleSelector, (el) => {
          return (el?.textContent || '--');
        });
      }
      
      const img = await page.$eval(imgSelector, (el) => {
        return (el?.src || '--');
      });

      let priceRu = await page.$eval(priceSelector, (el) => {
        return (el?.textContent || '--');
      });
      if (site === 'IKEA') priceRu = Number(priceRu);
      else if (site === 'SIMA-LAND')  priceRu = +priceRu.match(/\d+,*\d*/)[0].replace(',','.');

      const priceBy = coef ? ` Цена BY: ${(priceRu * coef).toFixed(2)} бел. руб.\r\n%0A` : '';
      const data = ` ${title.toUpperCase()}\r\n%0A ${priceBy} (Цена RU: ${priceRu} рус. руб.)\r\n%0A Ссылка на сайт: ${url} `;
      console.log(data)

      await https.get(`https://api.telegram.org/bot${tokenHanna}/sendPhoto?chat_id=${chatId}&photo=${img}&caption=${data}`, (res) => {
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
//  chat: { id: -1001465270771, title: 'СИМА_Малиновка_постоянные'},