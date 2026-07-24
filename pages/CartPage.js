const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.removeButtons = page.locator('button:has-text("Remove")');
  }

  /** Check that the cart page loaded and shows the expected title. */
  async verifyLoaded() {
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  /** Return true when a cart item matching the given name is visible. */
  async isProductInCart(name) {
    return await this.page.locator(`.cart_item:has-text("${name}")`).isVisible();
  }

  /** Remove a cart item by clicking its remove button. */
  async removeItem(name) {
    const button = this.page.locator(`.cart_item:has-text("${name}") button`);
    await button.click();
  }

  /** Click the checkout button to move to the checkout flow. */
  async checkout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
