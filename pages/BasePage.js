const { expect } = require('@playwright/test');

/**
 * BasePage - small collection of common helpers used by page objects.
 * These helpers keep tests readable and reduce repeated boilerplate.
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /** Wait until the provided locator is visible on the page. */
  async waitForVisible(locator) {
    await expect(locator).toBeVisible();
  }

  /** Wait for the current page URL to match the supplied pattern. */
  async waitForURL(url) {
    await this.page.waitForURL(url);
  }

  /** Return the visible text for a locator. */
  async getText(locator) {
    return await locator.textContent();
  }
}

module.exports = { BasePage };
