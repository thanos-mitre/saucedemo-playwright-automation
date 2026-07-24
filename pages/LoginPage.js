const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Open the SauceDemo login page and wait until the login form appears.
   * This keeps tests resilient by ensuring the page is ready before interacting.
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
    await expect(this.passwordInput).toBeVisible({ timeout: 15000 });
    await expect(this.loginButton).toBeVisible({ timeout: 15000 });
  }

  /**
   * Submit the login form with the provided credentials.
   * Username/password can be empty strings for negative tests.
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Return the current login error text (if any). */
  async getErrorText() {
    return await this.errorMessage.textContent();
  }
}

module.exports = { LoginPage };