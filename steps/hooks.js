const { Before, After } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { BurgerMenuPage } = require('../pages/BurgerMenuPage');

// Global setup hook: runs before each scenario.
// We launch a fresh browser context and create page objects so each scenario starts clean.
Before(async function () {
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext({
    ignoreHTTPSErrors: true,
    locale: 'en-US',
  });
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
  this.inventoryPage = new InventoryPage(this.page);
  this.cartPage = new CartPage(this.page);
  this.checkoutPage = new CheckoutPage(this.page);
  this.burgerMenuPage = new BurgerMenuPage(this.page);
});

// Global teardown hook: runs after each scenario.
// Capture a screenshot on failure and attach it to the Cucumber/Allure report.
After(async function (scenario) {
  try {
    const status = scenario && scenario.result && scenario.result.status;
    if (status === 'FAILED' && this.page) {
      const dir = path.resolve('allure-results');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const safeName = (scenario.pickle && scenario.pickle.name)
        ? scenario.pickle.name.replace(/[^a-z0-9-_]/gi, '_').slice(0, 60)
        : 'scenario';
      const name = `screenshot-${safeName}-${Date.now()}.png`;
      const filePath = path.join(dir, name);
      const buffer = await this.page.screenshot({ fullPage: true });
      fs.writeFileSync(filePath, buffer);
      // Attach the screenshot buffer to the Cucumber report so Allure picks it up.
      if (typeof this.attach === 'function') {
        await this.attach(buffer, 'image/png');
      } else {
        // Fallback: log file path if attach is not available.
        console.log('Saved failure screenshot:', filePath);
      }
    }
  } catch (err) {
    console.error('Error capturing failure screenshot:', err);
  } finally {
    if (this.page) await this.page.close().catch(() => {});
    if (this.context) await this.context.close().catch(() => {});
    if (this.browser) await this.browser.close().catch(() => {});
  }
});
