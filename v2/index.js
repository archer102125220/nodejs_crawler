require('dotenv').config();
const fs = require("fs");

// 引入所需要的第三方包
const superagent = require('superagent');
let hotNews = [];                                // 熱點新聞
let localNews = [];                              // 本地新聞
/**
* index.js
* [description] - 使用superagent.get()方法來訪問百度新聞首頁
*/
const cheerio = require('cheerio');
let getHotNews = (res) => {
    let hotNews = [];
    // 訪問成功，請求http://news.baidu.com/頁面所返回的資料會包含在res.text中。
    /* 使用cheerio模組的cherrio.load()方法，將HTMLdocument作為引數傳入函式
    以後就可以使用類似jQuery的$(selectior)的方式來獲取頁面元素
    */
    let $ = cheerio.load(res.text);
    // 找到目標資料所在的頁面元素，獲取資料
    $('div#pane-news ul li a').each((idx, ele) => {
        // cherrio中$('selector').each()用來遍歷所有匹配到的DOM元素
        // 引數idx是當前遍歷的元素的索引，ele就是當前便利的DOM元素
        let news = {
            title: $(ele).text(),        // 獲取新聞標題
            href: $(ele).attr('href')    // 獲取新聞網頁連結
        };
        hotNews.push(news);              // 存入最終結果陣列
    });
    return hotNews;
};
let getLocalNews = (res) => {
    let localNews = [];
    let $ = cheerio.load(res);
    // 本地新聞
    $('ul#localnews-focus li a').each((idx, ele) => {
        let news = {
            title: $(ele).text(),
            href: $(ele).attr('href'),
        };
        localNews.push(news);
    });
    // 本地資訊
    $('div#localnews-zixun ul li a').each((index, item) => {
        let news = {
            title: $(item).text(),
            href: $(item).attr('href')
        };
        localNews.push(news);
    });
    return localNews;
};

const crawler = () => {
    superagent.get('http://news.baidu.com/').end((err, res) => {
        if (err) {
            // 如果訪問失敗或者出錯，會這行這裡
            console.log(`熱點新聞抓取失敗 - ${err}`);
            fs.writeFileSync(__dirname + "/" + process.env.RESULT_NAME + ".json", JSON.stringify(`熱點新聞抓取失敗 - ${err}`));
        } else {
            // 訪問成功，請求http://news.baidu.com/頁面所返回的資料會包含在res
            // 抓取熱點新聞資料
            hotNews = getHotNews(res);
            localNews = getLocalNews(res);
            fs.writeFileSync(__dirname + "/" + process.env.RESULT_NAME + ".json", JSON.stringify({
                hotNews: hotNews,
                localNews: localNews
            }));
            console.log({
                hotNews: hotNews,
                localNews: localNews
            });
        }
    });
}
crawler();

// 每半小時爬一次資料
setInterval(crawler, 30 * 60 * 1000);