const { Given, When, Then } = require('@cucumber/cucumber');

// Verify the products page is displayed and all inventory items are loaded.
Then('I should see the Products page', async function () {
  await this.inventoryPage.verifyLoaded();
});

// Confirm that every configured product appears on the inventory page.
Then('I should see the available products', async function () {
  for (const name of this.testData.products.all) {
    await this.page.locator(`.inventory_item:has-text(\"${name}\")`).waitFor({ state: 'visible' });
  }
});

// Add a single product to the shopping cart.
When('I add a product to the cart', async function () {
  await this.inventoryPage.addProductByName(this.testData.products.primary);
});

// Add two products to the cart in one scenario.
When('I add two products to the cart', async function () {
  await this.inventoryPage.addProductByName(this.testData.products.primary);
  await this.inventoryPage.addProductByName(this.testData.products.secondary);
});

// Ensure the cart counter increases to one after adding a product.
Then('the cart badge should show 1 item', async function () {
  await this.inventoryPage.cartBadge.waitFor({ state: 'visible' });
  const count = await this.inventoryPage.cartCount();
  if (count !== 1) throw new Error(`Expected cart count 1, got ${count}`);
});
