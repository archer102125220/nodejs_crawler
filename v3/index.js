// https://www.sggzbz.cn/play/130691-0-0.html
//需知道網頁DOM結構
require('dotenv').config();
const fs = require("fs");
// 引入所需要的第三方包
const superagent = require('superagent');
const Nightmare = require('nightmare');          // 自動化測試包，處理動態頁面
// require('nightmare-load-filter')(Nightmare);     // 過濾請求
require('nightmare-iframe-manager')(Nightmare);     // 操作iframe
const nightmare = Nightmare({
  show: false,
  // openDevTools: {
  //   mode: 'detach'
  // },
  waitTimeout: 3 * 60 * 60 * 1000
});     // show:true  顯示內建模擬瀏覽器

const url = process.env.URL ? "http://" + process.env.URL : 'https://www.sggzbz.cn/play/130691-0-0.html';

async function crawler() {
  try {
    let count = 1;
    if (fs.existsSync(__dirname + "/output") === false) fs.mkdirSync(__dirname + "/output");
    const videoName = await nightmare
      .on('did-get-response-details', function (a, b, responseDetails = '') {
        if (
          responseDetails
            .match(
              /\.gif|\.css|\.js|\.jpg|\.php|\.html|\.ttf|\.png|blob\:|https\:\/\/tracker\.cdnbye\.com\/v1\/channel/g
            ) === null
        ) {
          console.log(count + '：' + responseDetails);
          const urlSplit = responseDetails.split('/');
          const FileName = urlSplit[urlSplit.length - 1];
          const writeStream = fs.createWriteStream(
            __dirname + "/" + 'output/' + count + '-' + FileName.replaceAll('.m3u8', '') + '.m3u8'
          );
          // Emitting finish event
          writeStream.
            on('finish', function () {
              console.log(responseDetails + ' Done！');
            });
          superagent
            .get(responseDetails)
            .pipe(writeStream);
          count++;
        }
      })
      .goto(url)
      // https://github.com/rosshinkley/nightmare-iframe-manager
      .enterIFrame('#cciframe')
      .enterIFrame('#player iframe')
      .click('button.dplayer-icon.dplayer-setting-icon')
      .click('div.dplayer-setting-item.dplayer-setting-speed')
      .click('div.dplayer-setting-speed-item[data-speed="2"]')
      .wait(function () {
        return document.querySelector('span.dplayer-ptime').innerHTML === document.querySelector('span.dplayer-dtime').innerHTML;
      })
      .resetFrame()
      .evaluate(() => document.querySelector("head title").innerHTML)
      .end();
    count--;
    console.log('Total:' + count);
    if (
      fs.existsSync(__dirname + "/" + videoName) === false &&
      fs.existsSync(__dirname + "/output") === true
    ) {
      try {
        fs.renameSync(__dirname + "/output", __dirname + "/" + videoName);
      }
      catch (e) {
        console.log('folder rename fail！');
        console.log(e);
      }
    }
    console.log('Downloaded！');
  } catch (error) {
    console.log(`影片擷取失敗 - ${error}`);
  }
}

crawler();