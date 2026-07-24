const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class BurgerMenuPage extends BasePage {
  constructor(page) {
    super(page);
    this.menuPanel = page.locator('.bm-menu-wrap');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetLink = page.locator('#reset_sidebar_link');
  }

  /** Ensure the burger menu has opened and is visible. */
  async verifyOpen() {
    await expect(this.menuPanel).toBeVisible();
  }

  /** Navigate to the All Items page via the sidebar. */
  async clickAllItems() {
    await this.verifyOpen();
    await this.allItemsLink.click();
  }

  /** Navigate to the About page via the sidebar. */
  async clickAbout() {
    await this.aboutLink.click();
  }

  /** Click the logout link in the burger menu. */
  async clickLogout() {
    await this.verifyOpen();
    await this.logoutLink.click();
  }

  /** Reset application state using the sidebar option. */
  async clickResetAppState() {
    await this.resetLink.click();
  }
}

module.exports = { BurgerMenuPage };