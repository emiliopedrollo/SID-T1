const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
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
        .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
        .build();
    try {
        await driver.get('https://www.google.com');
        // Enter text "cheese" and perform keyboard action "Enter"
        await driver.findElement(By.name('q')).sendKeys('cheese', Key.ENTER);
        let firstResult = await driver.wait(until.elementLocated(By.css('h3>div')), 10000);
        console.log(await firstResult.getAttribute('textContent'));
    } finally {
        await driver.quit();
    }

})();