const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const faker = require('faker');
const readline = require('readline');
const argv = require('minimist')(process.argv.slice(2));
const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const screen = {
        width: 640,
        height: 480
    };
    faker.locale = 'pt_BR';

    let phone;

    if (argv._.length !== 1) {
        console.error("Usage: node index.js PHONE\n\nVocê precisa informar um numero de telefone para concluir o cadastro de uma conta no linkedin");
        return 1;
    } else {
        phone = argv._[0];
    }

    let driver = await new Builder()
        .forBrowser('chrome')
        .usingServer('http://localhost:4444/wd/hub')
        .setChromeOptions(new chrome.Options().headless().windowSize(screen))
        .build();

    let mail = await new Builder()
        .forBrowser('firefox')
        .usingServer('http://localhost:4444/wd/hub')
        .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
        .build();

    try {

        // noinspection JSCheckFunctionSignatures
        let first_name = faker.name.firstName();
        // noinspection JSCheckFunctionSignatures
        let last_name = faker.name.lastName();
        // noinspection JSCheckFunctionSignatures
        let password = faker.random.alphaNumeric(faker.random.number({"min":15,"max":60}));

        await mail.get('https://10minutemail.com/10MinuteMail/index.html');
        let mail_address = await mail.findElement(By.css('.mail-address input')).getAttribute('value');

        await driver.get('https://www.linkedin.com/start/join');

        await driver.findElement(By.id('first-name')).sendKeys(first_name);
        await driver.findElement(By.id('last-name')).sendKeys(last_name);
        await driver.findElement(By.id('join-email')).sendKeys(mail_address);
        await driver.findElement(By.id('join-password')).sendKeys(password, Key.ENTER);

        let confirmPhone = await driver.wait(until.elementLocated(By.id('phoneNumber')), 10000);

        await confirmPhone.sendKeys(phone, Key.ENTER);

        rl.question('Código de verificação do LinkedIn: ', async (validation_code) => {

            let validation_code_input = await driver.wait(until.elementLocated(By.id('challenge-input')),10000);
            validation_code_input.sendKeys(validation_code, Key.ENTER);

            let state_select = (new Select(await driver.wait(until.elementLocated(By.id('location-state')),10000)));
            state_select.selectedIndex = 1;

            let city_select = driver.findElement(By.id('location-city'));
            await driver.wait(until.elementIsEnabled(city_select),10000);
            city_select.selectedIndex = 1;

            await driver.findElement(By.css("button#ember331")).click(); // avançar

            await driver.wait(until.elementLocated(By.id("ember1259"))).click(); // Sou estudante

        });


        // await driver.findElement(By.css('form#extended-nav-search input')).sendKeys('Emilio Brandt Pedrollo', Key.ENTER);
        // let firstResult = await driver.wait(until.elementLocated(By.css('.search-results li.search-result a')), 10000);
        // let href = await firstResult.getAttribute('href');
        // console.log(href);
    } finally {
        rl.close();
        await driver.quit();
        await mail.quit();
    }

})();