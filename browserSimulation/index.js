// https://www.npmjs.com/package/puppeteer
require("dotenv").config();
// const puppeteer = require("puppeteer");
const Nightmare = require("nightmare"); // 自動化測試包，處理動態頁面
const nightmare = Nightmare({ show: true }); // show:true  顯示內建模擬瀏覽器

(async () => {
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto(process.env.URL ? 'http://' + process.env.URL : 'https://example.com');

  // https://stackoverflow.com/questions/50584770/passing-multiple-cookies-to-puppeteer
  // Get the 'viewport' of the page, as reported by the page.
  // const dimensions = await page.evaluate(() => {
  //   return {
  //     width: document.documentElement.clientWidth,
  //     height: document.documentElement.clientHeight,
  //     deviceScaleFactor: window.devicePixelRatio,
  //     cookie: document.cookie
  //   };
  // });

  // await browser.close();

  const url = (process.env.URL || "").includes("http")
    ? process.env.URL
    : process.env.URL !== ""
    ? "http://" + process.env.URL
    : "https://example.com";

  console.log(url);

  // https://stackoverflow.com/questions/42188756/nightmarejs-how-to-set-cookie
  const test = await nightmare.goto(url).evaluate(() => {
    const meta = [];
    document.querySelectorAll("meta").forEach((element) => {
      console.log(Object.keys(element.attributes));
      const metaData = {};
      Object.keys(element.attributes).forEach((key) => {
        metaData[element.attributes[key].localName] =
          element.attributes[key].nodeValue;
      });
      meta.push(metaData);
    });

    return {
      host: window.location.href,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio,
      cookie: document.cookie,
      meta,
    };
  })
  .end();

  console.log("test:", test);
})();
