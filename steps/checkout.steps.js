const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Ensure the scenario begins on the checkout information page.
Given('I am on the checkout information page', async function () {
  if (!this.page.url().includes('checkout-step-one.html')) {
    await this.inventoryPage.openCart();
    await this.cartPage.verifyLoaded();
    await this.cartPage.checkout();
    await this.page.waitForURL('**/checkout-step-one.html', { timeout: 20000 });
  }
});

// Submit valid checkout details to complete the purchase flow.
When('I submit valid checkout information', async function () {
  await this.checkoutPage.fillInformation(
    this.testData.checkout.firstName,
    this.testData.checkout.lastName,
    this.testData.checkout.postalCode
  );
  await this.checkoutPage.proceedToOverview();
  await this.checkoutPage.finish();
});

// Submit incomplete information to trigger validation errors.
When('I submit incomplete checkout information', async function () {
  await this.checkoutPage.fillInformation('', '', '');
  await this.checkoutPage.clickContinue();
});

// Verify success confirmation text after completing checkout.
Then('I should see a successful order confirmation', async function () {
  await expect(this.checkoutPage.completeHeader).toBeVisible({ timeout: 15000 });
  const text = await this.checkoutPage.getCompleteText();
  if (!text || !text.includes('Thank you for your order!')) throw new Error(`Unexpected confirmation text: ${text}`);
});

// Verify checkout validation when required fields are missing.
Then('I should see a first name required error', async function () {
  await expect(this.checkoutPage.errorMessage).toBeVisible({ timeout: 15000 });
  const text = await this.checkoutPage.getErrorText();
  if (!text || !text.includes('First Name is required')) throw new Error(`Unexpected error: ${text}`);
});
