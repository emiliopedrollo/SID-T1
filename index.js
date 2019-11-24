const chrome = require('selenium-webdriver/chrome');
const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {

    const screen = {
        width: 640,
        height: 480
    };

    let driver = await new Builder()
        .forBrowser('chrome')
        .usingServer('http://localhost:4444/wd/hub')
        .setChromeOptions(new chrome.Options().headless().windowSize(screen))
        .build();

    try {
        await driver.get('https://www.linkedin.com/feed');
        await driver.findElement(By.css('form#extended-nav-search input')).sendKeys('Nome', Key.ENTER);
        let firstResult = await driver.wait(until.elementLocated(By.css('.search-results li.search-result a')), 10000);
        let href = await firstResult.getAttribute('href');
        console.log(href);
    } finally {
        await driver.quit();
    }

})();