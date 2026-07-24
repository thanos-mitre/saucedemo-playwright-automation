# Assumptions and Limitations

This document lists explicit assumptions made by the test framework and the known limitations of the current test suite. It is intended to help maintainers, reviewers, and CI operators understand constraints and design decisions so failures and gaps can be diagnosed quickly.

## Purpose
- Provide a single source of truth describing what the automation expects about the environment, the AUT (application under test), and the test design.

## Environment & Infrastructure Assumptions
- Tests run on machines with a modern Node.js runtime (Node 18+ recommended) and npm.
- The host can reach `https://www.saucedemo.com` over the network with low latency and stable connectivity.
- A Chromium-based browser compatible with Playwright is available (Playwright will download what it needs when `npx playwright install` is invoked).
- CI runners provide sufficient CPU, memory, and disk for browser execution and artifacts.

## Test Data and Credentials
- The suite uses the fixture file `data/test-data.json` for user credentials, product identifiers, and checkout values.


## Application Behavior Assumptions
- The AUT uses static, predictable routes (e.g., `/inventory.html`, `/checkout-step-one.html`) and CSS selectors used in page objects.
- Authentication uses form-based login and redirects to `/inventory.html` upon success.
- UI copy and error messages are assumed to remain the same or contain expected keywords; assertions tolerate several common error messages but are not fully fuzz-tolerant.

## Test Runner & Execution Assumptions
- The project is BDD-first: Cucumber drives scenarios and Playwright is used as the browser automation library within Cucumber hooks.
- Tests run headlessly by default (see `steps/hooks.js` to toggle `headless: false` for debugging).
- Tests are designed to be executed sequentially per CI job. While many steps are idempotent, some scenarios depend on app state and may conflict if tests run concurrently against the same environment without isolation.

## Reporting Assumptions
- Allure results are produced by the Cucumber Allure formatter and written to `allure-results/` during execution.
- `allure-commandline` (installed as a dev dependency) is required to generate the HTML report locally via `npm run test:report`.

## Known Limitations and Risks
- Locators are CSS-based and may be brittle if UI structure or class names change. Prefer more robust selectors or data-test attributes where possible.
- The suite does not currently reset application state between scenarios beyond normal app flows; residual state in the AUT (server-side cart persistence, cached sessions) may cause intermittently failing scenarios.
- Cross-browser coverage is limited — tests run against Chromium by default; Firefox and WebKit are not exercised unless explicitly added.
- No mobile emulation coverage is included by default.
- Timing and flaky failures: network slowness, intermittent site issues, or CI resource starvation may cause timeouts; timeouts are conservative but may need tuning.
- Accessibility and visual regression checks are not included in this suite.
