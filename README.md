# SauceDemo Playwright BDD Automation


## Project Overview
This repository contains a behavior-driven automation framework for the SauceDemo website (`https://www.saucedemo.com`). The project uses:

- `Playwright` for browser automation
- `Cucumber` for BDD-style feature execution
- `Allure` for test reporting
- `Page Object Model` for maintainable page encapsulation
- `JSON` test data fixtures for reusable inputs

## Repository Structure
- `cucumber.js` — Cucumber CLI configuration, steps loading, and Allure formatter
- `features/` — Gherkin feature files covering authentication, products, cart, checkout, and burger menu scenarios
- `steps/` — Step definition files organized by domain and global hooks
- `steps/world.js` — Shared Cucumber world object providing browser, page objects, and test data
- `pages/` — Page Object Model classes for UI interactions and verification logic
- `data/test-data.json` — Reusable test data for users, products, and checkout information
- `.gitignore` — Files and folders excluded from version control
- `package.json` — Scripts and dependencies for running and reporting tests

## Key Concepts
### BDD and Cucumber
The framework uses Cucumber to express tests as business-readable scenarios in `.feature` files. Each scenario maps to step implementations in `steps/*.js`.

### Page Object Model (POM)
Each page class in `pages/` encapsulates selectors and actions for a specific UI page:

- `LoginPage.js` — login actions and error handling
- `InventoryPage.js` — product page verification and cart interaction
- `CartPage.js` — cart page validation and checkout navigation
- `CheckoutPage.js` — checkout flow and validation handling
- `BurgerMenuPage.js` — burger menu navigation actions
- `BasePage.js` — shared helpers for page interactions

### Shared Test Data
Test inputs are centralized in `data/test-data.json`. This file holds credentials, product names, and checkout values so scenarios stay stable and readable.

### Custom Cucumber World
`steps/world.js` configures a shared world object that initializes:

- `testData` — fixture data loaded from `data/test-data.json`
- `browser` and `page` instances
- page object references

This ensures step implementations use a consistent runtime context.

## Environment Requirements
- Node.js 18 or later
- npm
- Internet access to reach `https://www.saucedemo.com`

## Installation
1. Clone the repository
2. Open the repository root in your terminal
3. Install dependencies:

```bash
npm install
```

## Running Tests
### Execute the full BDD suite

```bash
npm test
```

### Run the same suite explicitly as BDD

```bash
npm run bdd
```

### Run the suite in parallel

```bash
npm run test:parallel
```

You can also override the worker count:

```bash
CUCUMBER_PARALLEL=4 npm run test:parallel
```

### Generate the Allure report

```bash
npm run test:report
```

### Open the generated Allure report locally

```bash
npm run test:report:open
```

## How the Framework Works
### Test Execution Flow
1. Cucumber loads `cucumber.js` and applies the configuration.
2. `steps/world.js` registers the shared world object for each scenario.
3. `steps/hooks.js` opens a browser and page before each scenario and closes them afterward.
4. Step definitions in `steps/*.js` execute actions through page objects.
5. Page objects in `pages/` contain the low-level selectors and business actions.
6. Results are emitted to Allure and the console reporter.

### Example Scenario Coverage
- Login with valid, locked-out, and invalid credentials
- Product page verification and inventory visibility
- Adding items to the cart and verifying cart contents
- Checkout flow with valid and invalid inputs
- Burger menu navigation and logout behavior

## Editing and Extending
### Add a new page object
1. Create `pages/<PageName>.js`
2. Extend `BasePage` for shared helper access
3. Add selectors and actions for the page
4. Expose the page through `steps/hooks.js`

### Add a new scenario
1. Create or extend a `.feature` file under `features/`
2. Add Gherkin steps describing the behavior
3. Implement step definitions in `steps/*.js`
4. Use `this.testData` for shared input values

### Add shared data
Update `data/test-data.json` and reference values from steps via `this.testData`.

## Architecture and Design Patterns

This section describes the framework structure, component responsibilities, execution flow, and recommended design patterns used throughout the repository. It is intended to help new contributors understand how pieces fit together and where to extend functionality.

High-level components

- features/
  - Gherkin feature files (business-readable scenarios). Keep scenarios focused on behavior, not implementation.
- steps/
  - Cucumber step definitions and hooks. Step files map feature steps to code and use page objects to interact with the UI.
  - steps/world.js exposes a Custom World with testData, browser/page, and page objects to every step.
  - steps/hooks.js manages the browser lifecycle (Before/After) and failure artifact capture.
- pages/
  - Page Object Model (POM) classes that encapsulate selectors, actions, and verification logic for a single UI page (LoginPage, InventoryPage, CartPage, CheckoutPage, BurgerMenuPage).
  - BasePage provides small helpers used by page objects.
- data/
  - test-data.json centralizes fixture data for users, products, and checkout values.
- allure-results/
  - Generated during test runs; consumed by Allure to produce HTML reports.

Execution flow (scenario run)

1. Cucumber loads configuration and feature files.
2. For each scenario, a new Custom World is created (steps/world.js) and Before hooks run (steps/hooks.js) to launch Playwright and create page objects.
3. Step definitions execute in the scenario context using this.page, this.loginPage, this.inventoryPage, etc.
4. Assertions and interactions are implemented in page objects; steps orchestrate high-level behavior using those objects.
5. After hooks close the browser and capture failure artifacts (screenshots) if needed.
6. Cucumber writes results to the configured format (Allure JSON) and the console reporter.

Design patterns and principles

- Page Object Model (POM):
  - Each page class owns selectors and actions for a single page or component. Pages should provide expressive methods (e.g., addProductByName, verifyLoaded) that hide low-level locator logic from steps.
  - Keep page classes focused (Single Responsibility). If a page grows large, split it into smaller components or helper classes.

- Custom World & Dependency Injection:
  - Use steps/world.js to provide a scenario-scoped context (testData, browser, page instances, and page objects). Steps access runtime dependencies as properties on `this`.

- Hooks for lifecycle management:
  - Use Before/After hooks to manage browser lifecycle, test setup/teardown, and artifact collection. Avoid heavy logic in hooks; prefer simple orchestration.

- Test Data Fixtures:
  - Centralize stable values in data/test-data.json. Steps should read shared data via this.testData to maximize readability and avoid duplicated literals.

- Assertions and Robust Selectors:
  - Prefer data-test attributes or stable identifiers for selectors. Avoid brittle CSS paths tied to layout when possible.
  - Page object methods should use Playwright's expect and appropriate waiting (toBeVisible, waitForURL) to reduce flakiness.

Extension and contribution guidance

- Adding a new page object:
  1. Create pages/NewPage.js that extends BasePage.
  2. Add selectors and actions; keep method names expressive and intent-focused.
  3. Register the page object in steps/hooks.js so it is available on the world (this.newPage).
  4. Write feature files and step definitions that call the page methods.

- Adding a new step:
  1. Add Gherkin to a .feature file under features/.
  2. Implement the matching step definition in the appropriate file under steps/ (or create a new domain file).
  3. Reuse existing step definitions when possible to avoid duplication.

- Recommended selector strategy:
  - Use data-test or data-testid attributes owned by the application team (e.g., [data-test="checkout"]). These are more stable than classes or deeply nested selectors.

CI, parallelization, and isolation notes

- The suite runs headlessly by default. For debugging, toggle headless: false in steps/hooks.js.
- Parallel execution is now supported through the Cucumber CLI wrapper in scripts/run-cucumber.js. It is best used with isolated environments or per-scenario accounts because the SauceDemo app still maintains shared cart/session state.
- If parallel execution is required:
  - Use environment isolation (per-run accounts or reset endpoints).
  - Implement API helpers to seed/clean data before scenarios.
  - Add tags (@smoke, @regression) to run smaller focused subsets in CI.

- Flakiness mitigation:
  - Prefer explicit waits via Playwright expects in page objects.
  - Use retries sparingly in CI and only for flaky tests after identifying root causes.

Auditability and reporting

- Allure is used to generate rich test reports. Results are stored in allure-results/ and can be rendered with `npm run test:report`.
- Hooks capture screenshots on failure and attach them to Cucumber/Allure reports when possible.

Maintenance tips

- Keep feature files high-level and business-focused. Move UI details into page objects so changes to the UI require updating only the pages/ layer.
- When application selectors or routes change, update only the affected page object methods and, if necessary, step assertions.
- Add documentation for any architectural changes or major test additions (update README or add an ARCHITECTURE.md in docs/).

## Recommended Best Practices
- Keep feature files readable and business-focused
- Avoid implementation logic inside `.feature` files
- Use the page object layer for browser interactions
- Keep test data separate from step logic
- Reuse step definitions when possible across feature files

## Notes
- The current setup runs headlessly by default; modify `headless: true` in `steps/hooks.js` if you need visible browser debugging.
- The project is intentionally BDD-first and does not require Playwright test runner configuration.
- `allure-results` is generated during Cucumber execution and can be used to build HTML reports.
