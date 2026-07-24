const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('.complete-header');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /** Fill in the checkout information form. */
  async fillInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /** Click the continue button to proceed to the overview step. */
  async continue() {
    await expect(this.continueButton).toBeVisible({ timeout: 10000 });
    await this.continueButton.click();
    await this.page.waitForURL('**/checkout-step-two.html', { timeout: 20000 }).catch(() => {});
  }

  /** Complete the purchase by clicking the finish button. */
  async finish() {
    await expect(this.finishButton).toBeVisible({ timeout: 15000 });
    await this.finishButton.click();
  }

  /** Return the thank-you/complete header text shown after a successful order. */
  async getCompleteText() {
    return await this.completeHeader.textContent();
  }

  /** Read the validation error shown on the checkout page. */
  async getErrorText() {
    return await this.errorMessage.textContent();
  }
}

module.exports = { CheckoutPage };