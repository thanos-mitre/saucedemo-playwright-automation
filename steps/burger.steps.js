const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Open the burger menu panel from the inventory page.
When('I open the burger menu', async function () {
  await this.inventoryPage.openBurgerMenu();
});

// Use the burger menu to navigate to the All Items page.
When('I navigate to all items', async function () {
  await this.burgerMenuPage.clickAllItems();
});

// Log out from the application using the burger menu.
When('I logout', async function () {
  await this.burgerMenuPage.clickLogout();
});

// Confirm the product page is still visible after navigation.
Then('I should remain on the products page', async function () {
  await this.page.waitForURL(/inventory.html/, { timeout: 15000 }).catch(() => {});
  await this.inventoryPage.verifyLoaded();
});

// Confirm the user is redirected back to the login page after logout.
Then('I should be returned to the login page', async function () {
  await this.page.waitForURL('https://www.saucedemo.com/', { timeout: 20000 }).catch(() => {});
  await expect(this.loginPage.loginButton).toBeVisible({ timeout: 15000 });
});
