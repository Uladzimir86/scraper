const puppeteer = require('puppeteer');
//const fs = require('fs/promises');

const url = process.argv[2];
(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(url);

  const title = await page.$eval('.range-revamp-aspect-ratio-image__image', (el) => {
    return el?.alt || '--'
  });
  const img = await page.$eval('.range-revamp-aspect-ratio-image__image', (el) => {
    return el?.src || '--'
  });
  const price = await page.$eval('.range-revamp-price__integer', (el) => {
    return el?.textContent;
  });


  console.log()
  console.log(url)
  console.log(title)
  console.log(price)
  console.log(decodeURIComponent( title))
  require('child_process').spawn('clip').stdin.end(` ${title.toUpperCase()} \r\n Фото: ${img} \r\n Стоимость: ${price} рус. руб. \r\n Ссылка на сайт: ${url} `, 'utf16le');

  await browser.close();
})();
