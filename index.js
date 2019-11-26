const chrome = require('selenium-webdriver/chrome');
const readline = require('readline-sync');
const argv = require('minimist')(process.argv.slice(2));
const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {

    const screen = {
        width: 640,
        height: 480
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

    let driver = await new Builder()
        .forBrowser('chrome')
        .usingServer('http://localhost:4444/wd/hub')
        .setChromeOptions(new chrome.Options().headless().windowSize(screen))
        .build();

    try {
        await driver.get('https://www.linkedin.com/uas/login');

		await driver.findElement(By.id('username')).sendKeys(username);
        await driver.findElement(By.id('password')).sendKeys(password, Key.ENTER);
		

		let links = "https://br.linkedin.com/in/gabriel-belinazo-54b99680";
		let nomes = "teste";
		
		//Pesquisar os dados (Via link direto ou pesquisar o nome)
		 
		await driver.get(links);
        let nome = await driver.wait(until.elementLocated(By.className('inline t-24 t-black t-normal break-words')), 10000);
		let empresa = await driver.wait(until.elementLocated(By.className('pv-entity__secondary-title t-14 t-black t-normal')), 10000);
       

	   /*await driver.findElement(By.css('form#extended-nav-search input')).sendKeys('Nome', Key.ENTER);
        let firstResult = await driver.wait(until.elementLocated(By.css('.search-results li.search-result a')), 10000);
        let href = await firstResult.getAttribute('href');*/
		
		//Salvar os dados
		
        console.log(href);
    } finally {
        await driver.quit();
    }

})();