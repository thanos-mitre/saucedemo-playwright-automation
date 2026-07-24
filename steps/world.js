const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');
const testData = require('../data/test-data.json');

setDefaultTimeout(60000);

class CustomWorld {
  constructor({ attach, parameters }) {
    // testData is loaded from the JSON fixture and is available to every step as `this.testData`.
    this.testData = testData;
    this.attach = attach;
    this.parameters = parameters || {};
    // These properties are initialized in hooks before each scenario runs.
    this.browser = null;
    this.page = null;
    this.loginPage = null;
    this.inventoryPage = null;
    this.cartPage = null;
    this.checkoutPage = null;
    this.burgerMenuPage = null;
    this.context = null;
    this.sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

setWorldConstructor(CustomWorld);
