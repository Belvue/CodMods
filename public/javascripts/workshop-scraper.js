﻿const puppeteer = require('puppeteer');
var pageId = 1;
var maxPageSize = 0;

async function main() {
    var output = [];
    const browser = await puppeteer.launch({
        headless: true
    });
    console.log(`Loading Page ${pageId}`)
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3571.0 Mobile Safari/537.36');
    await page.goto('https://steamcommunity.com/workshop/browse/?appid=311210&browsesort=trend&section=readytouseitems&actualsort=trend&p=' + pageId);
    const elem = "div.workshopItem";
    await page.waitForSelector(elem);
    if (pageId === 1) {
        maxPageSize = await page.$eval('a.pagelink:nth-child(4)', page => parseInt(page.innerText.replace(',', '')));
        console.log(`Found ${maxPageSize} Page(s)`);
    }
    var collection = await page.$$(elem);

    for (var i = 0; i < collection.length; i++) {
        var elemz = collection[i];
        var Mod = await elemz.$eval(".workshopItemTitle", ModName => ModName.innerText);
        var Link = await elemz.$eval("a", href => href.href.replace('&searchtext=', ''));
        var Author = await elemz.$eval('.workshopItemAuthorName a', author => author.innerText);
        output.push({
            Mod: Mod,
            Author: Author,
            Link: Link
        });
    }
    await browser.close();
    return new Promise(resolve => {
        resolve(output);
    });
};

module.exports = {
    main: main
}