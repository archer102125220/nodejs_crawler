// https://www.npmjs.com/package/puppeteer
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(process.env.URL ? 'http://' + process.env.URL : 'https://example.com');

  // Get the 'viewport' of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio,
      cookie: document.cookie
    };
  });

  console.log('Dimensions:', dimensions);

  await browser.close();
})();