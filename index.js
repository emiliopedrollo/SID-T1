const chrome = require('selenium-webdriver/chrome');
const readline = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const csv = require('csv-parser');
const allSettled = require('promise.allsettled');
const {Builder, By, Key, until} = require('selenium-webdriver');

return (async function example() {

    const screen = {
        width: 1920,
        height: 1080
    };

    let username;
    let password;

    if (argv._.length < 1) {
        console.error("Usage: node index.js LOGIN\n\nVocê precisa informar um login para o LinkedIn");
        return 1;
    } else {
        username = argv._[0];
        if (process.env.LN_PASSWORD) {
            password = process.env.LN_PASSWORD;
        } else if (argv._.length === 2) {
            password = argv._[1];
        } else {
            password = readline.question('What is LinkedIn account password? ', {
                hideEchoBack: true
            });
        }
    }

    let promises = [];

    fs.createReadStream('names.csv')
        .pipe(csv())
        .on('data', function(row) {
            let name = row.nome;
            promises.push(new Promise(async (resolve,reject) => {
                let driver = await new Builder()
                    .forBrowser('chrome')
                    .usingServer('http://localhost:4444/wd/hub')
                    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
                    .build();
                try {
                    await driver.get('https://www.linkedin.com/uas/login');
                    await driver.findElement(By.id('username')).sendKeys(username);
                    await driver.findElement(By.id('password')).sendKeys(password, Key.ENTER);

                    await driver.get('https://www.linkedin.com/search/results/all/?keywords=' + name);

                    let firstResult = await driver.wait(until.elementLocated(By.css('.search-results li.search-result a')), 10000);
                    let href = await firstResult.getAttribute('href');

                    await driver.get(href);

                    console.log("Gathering info from " + name);

                    let currentCompanyTag = await driver.wait(until.elementLocated(By.css('a[data-control-name="position_see_more"] span')), 10000);

                    let currentCompany = await currentCompanyTag.getText();

                    resolve({"nome" : name, "empresa": currentCompany, "linkedin": href});
                } catch(e) {
                    console.error(e);
                    reject(e);
                } finally {
                    await driver.takeScreenshot().then((img, err) => {
                        if (err) console.error(err);
                        if (!fs.existsSync('site/images')) fs.mkdirSync('site/images');
                        fs.writeFile('site/images/' + name + '.png', img, 'base64', function (err) {
                            if (err) console.error(err);
                        })
                    });
                    await driver.close();
                    await driver.quit();
                }
            }));
        })
        .on('end',() => {
            allSettled.shim();
            Promise.allSettled(promises).then(results => {
                results = results.filter(result => result.status === 'fulfilled').map(result => result.value);
                fs.writeFileSync("site/results.json", JSON.stringify(results));
            });
        });


    return 0;

})();
