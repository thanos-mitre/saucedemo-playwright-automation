const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.burgerButton = page.locator('#react-burger-menu-btn');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  /** Ensure the inventory page is visible and contains the expected items. */
  async verifyLoaded() {
    await expect(this.pageTitle).toHaveText('Products', { timeout: 15000 });
    await expect(this.inventoryItems).toHaveCount(6, { timeout: 15000 });
  }

  /** Click the add-to-cart button for a product by its display name. */
  async addProductByName(name) {
    const item = this.page.locator(`.inventory_item:has-text("${name}")`);
    await expect(item).toBeVisible({ timeout: 15000 });
    const button = item.locator('button');
    await expect(button).toBeVisible({ timeout: 15000 });
    await button.click();
  }

  /** Click the remove button for a product by name. */
  async removeProductByName(name) {
    const button = this.page.locator(`.inventory_item:has-text("${name}") button`);
    await button.click();
  }

  /** Return true if a product with the given name appears in the inventory. */
  async isProductVisible(name) {
    return await this.page.locator(`.inventory_item:has-text("${name}")`).isVisible();
  }

  /** Navigate to the cart page using the cart icon/link. */
  async openCart() {
    await expect(this.cartLink).toBeVisible({ timeout: 15000 });
    await this.cartLink.click();
  }

  /** Open the burger (sidebar) menu. */
  async openBurgerMenu() {
    await this.burgerButton.click();
  }

  /** Read the number displayed on the cart badge (0 when absent). */
  async cartCount() {
    if (await this.cartBadge.count() === 0) return 0;
    return parseInt(await this.cartBadge.textContent(), 10);
  }
}

module.exports = { InventoryPage };