const { Given, When, Then } = require('@cucumber/cucumber');

// Ensure a product is in the cart before starting cart-specific scenarios.
Given('I have added a product to the cart', async function () {
  await this.loginPage.goto();
  await this.loginPage.login(
    this.testData.users.standard.username,
    this.testData.users.standard.password
  );
  await this.inventoryPage.verifyLoaded();
  await this.inventoryPage.addProductByName(this.testData.products.primary);
  await this.inventoryPage.openCart();
});

// Navigate from the products page to the cart page.
When('I go to the cart page', async function () {
  await this.inventoryPage.openCart();
});

// Remove the selected product from the cart using the page object.
When('I remove that product from the cart', async function () {
  await this.inventoryPage.openCart();
  await this.cartPage.verifyLoaded();
  await this.cartPage.removeItem(this.testData.products.primary);
  await this.page.waitForLoadState('networkidle').catch(() => {});
});

// Validate that both selected items appear in the cart.
Then('I should see both products in the cart', async function () {
  await this.cartPage.verifyLoaded();
  if (!(await this.cartPage.isProductInCart(this.testData.products.primary))) throw new Error('Primary product missing');
  if (!(await this.cartPage.isProductInCart(this.testData.products.secondary))) throw new Error('Secondary product missing');
});

// Confirm that the removed item is no longer present.
Then('it should no longer appear in the cart', async function () {
  await this.cartPage.verifyLoaded();
  const visible = await this.page.locator(`.cart_item:has-text(\"${this.testData.products.primary}\")`).count();
  if (visible !== 0) throw new Error('Product still present after removal');
});

// Assert that the cart contains no items.
Then('the cart should be empty', async function () {
  // ensure we're on the cart page
  await this.inventoryPage.openCart();
  await this.cartPage.verifyLoaded();
  const count = await this.cartPage.cartItems.count();
  if (count !== 0) throw new Error(`Expected empty cart, found ${count} items`);
});

// Validate that the previously-added product remains in the cart after logout/re-login.
Then('I should see the product in the cart', async function () {
  await this.inventoryPage.openCart();
  await this.cartPage.verifyLoaded();
  if (!(await this.cartPage.isProductInCart(this.testData.products.primary)))
    throw new Error('Expected product to persist in cart after logout/re-login');
});
