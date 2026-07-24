const { Given, When, Then } = require('@cucumber/cucumber');

// Navigate to the login page before performing login actions.
Given('I am on the login page', async function () {
  await this.loginPage.goto();
});

// Login using empty credential values to validate client-side/server-side handling.
When('I login with empty credentials', async function () {
  await this.loginPage.login('', '');
});

// Log in as the standard user using known valid credentials.
Given('I am logged in as a standard user', async function () {
  await this.loginPage.goto();
  await this.loginPage.login(
    this.testData.users.standard.username,
    this.testData.users.standard.password
  );
});

// Log in as any supported SauceDemo user from the shared data fixture.
Given('I am logged in as the {string} user', async function (userKey) {
  const user = this.testData.users[userKey];
  if (!user) throw new Error(`Unknown user key: ${userKey}`);
  await this.loginPage.goto();
  await this.loginPage.login(user.username, user.password);
  await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  await this.page.waitForURL('**/inventory.html', { timeout: 20000 }).catch(() => {});
});

When('I login with a standard user', async function () {
  await this.loginPage.login(
    this.testData.users.standard.username,
    this.testData.users.standard.password
  );
});

// Attempt login using a locked-out user account.
When('I login with a locked out user', async function () {
  await this.loginPage.login(this.testData.users.lockedOut.username, this.testData.users.lockedOut.password);
});

// Login using any supported SauceDemo user defined in the shared test data.
When('I login with the {string} user', async function (userKey) {
  const user = this.testData.users[userKey];
  if (!user) throw new Error(`Unknown user key: ${userKey}`);
  await this.loginPage.login(user.username, user.password);
});

// Attempt login using invalid credentials.
When('I login with invalid credentials', async function () {
  await this.loginPage.login(this.testData.users.invalid.username, this.testData.users.invalid.password);
});

// Validate the locked out user error message is shown.
Then('I should see a locked out error message', async function () {
  await this.loginPage.errorMessage.waitFor({ state: 'visible' });
  const text = await this.loginPage.getErrorText();
  if (!text.includes('locked out')) throw new Error(`Expected locked out error, got: ${text}`);
});

// Validate successful redirection to the products page.
Then('I should be redirected to the products page', async function () {
  await this.inventoryPage.page.waitForURL('**/inventory.html');
  await this.inventoryPage.verifyLoaded();
});

// Navigate directly to the inventory URL to verify unauthenticated redirect behavior.
When('I navigate directly to the inventory page', async function () {
  await this.page.goto('https://www.saucedemo.com/inventory.html');
});

// Validate that the anonymous user is redirected back to the login page.
Then('I should be redirected to the login page', async function () {
  await this.page.waitForURL('https://www.saucedemo.com/');
});

// Validate the invalid login error message is shown.
Then('I should see a login error message', async function () {
  await this.loginPage.errorMessage.waitFor({ state: 'visible' });
  const text = await this.loginPage.getErrorText();
  const ok = text && (
    text.includes('Username and password do not match any user in this service') ||
    text.toLowerCase().includes('username is required') ||
    text.toLowerCase().includes('password is required') ||
    text.toLowerCase().includes('epic sadface')
  );
  if (!ok) throw new Error(`Expected login error, got: ${text}`);
});
