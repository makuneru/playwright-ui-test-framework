# Playwright UI Test Framework

A comprehensive Playwright test automation framework for SauceDemo e-commerce application using Page Object Model pattern and multi-environment support.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Environment Profiles](#environment-profiles)
- [Page Object Model](#page-object-model)
- [Writing New Tests](#writing-new-tests)
- [CI/CD Integration](#cicd-integration)

## Overview

This framework provides:

- **Page Object Model (POM)** architecture for maintainable test code
- **Multi-environment support** via JSON profiles (default, staging, local)
- **Authentication state management** for faster test execution
- **Cross-browser testing** (Chromium, Firefox, WebKit)
- **Comprehensive reporting** with HTML reports and screenshots
- **TypeScript** for type safety and better IDE support

## Project Structure

```
playwright-ui-test-framework/
├── .auth/                          # Authentication state files (auto-generated)
├── profiles/                       # Environment configuration files
│   ├── default.json               # Production environment config
│   ├── staging.json               # Staging environment config
│   └── local.json                 # Local development config
├── src/
│   ├── pages/                     # Page Object Model classes
│   │   ├── LoginPage.ts          # Login page POM
│   │   ├── ProductsPage.ts       # Products page POM
│   │   ├── CartPage.ts           # Cart page POM
│   │   └── CheckoutPage.ts       # Checkout page POM
│   ├── setup/                     # Test setup and teardown
│   │   ├── auth.setup.ts         # Authentication setup
│   │   └── auth.teardown.ts      # Authentication cleanup
│   └── utils/                     # Utility functions
│       ├── config.ts             # Configuration loader
│       └── test-helpers.ts       # Helper functions
├── tests/                         # Test suites
│   ├── login-functionality/
│   ├── add-item-to-cart/
│   ├── remove-item-from-cart/
│   └── checkout-process/
├── playwright/
│   ├── output/                    # Test artifacts (screenshots, videos)
│   └── report/                    # HTML test reports
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Project dependencies
└── tsconfig.json                  # TypeScript configuration
```

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Verify installation:

```bash
npx playwright --version
```

## Running Tests

### Run All Tests

```bash
# Run all tests with all browsers
npm test

# Run tests in headed mode (see the browser)
npm test -- --headed

# Run tests in UI mode (interactive)
npm test -- --ui
```

### Run Specific Test Suites

```bash
# Run only login tests
npm test tests/login-functionality/

# Run only cart tests
npm test tests/add-item-to-cart/

# Run only checkout tests
npm test tests/checkout-process/
```

### Run Specific Test Files

```bash
# Run a specific test file
npm test tests/login-functionality/successful-login.noauth.spec.ts

# Run with specific browser
npm test tests/login-functionality/successful-login.noauth.spec.ts --project=ui-tests
```

### Run with Different Projects

```bash
# Run with Chrome (default project)
npm test -- --project=ui-tests

# Run with different browsers
BROWSER=firefox npm test
BROWSER=safari npm test
BROWSER=edge npm test
```

### View Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report playwright/report
```

## Environment Profiles

The framework supports multiple environments through JSON profile files located in the `profiles/` directory.

### Available Profiles

- **default** - Production environment
- **staging** - Staging environment
- **local** - Local development (headed mode, longer timeouts)

### Using Profiles

Set the `PROFILE` environment variable to switch environments:

```bash
# Run tests against staging
PROFILE=staging npm test

# Run tests in local mode (headed)
PROFILE=local npm test

# Run tests against production (default)
npm test
```

### Profile Structure

Each profile is a JSON file with the following structure:

```json
{
  "environment": "prod",
  "baseUrl": "https://www.saucedemo.com",
  "credentials": {
    "standard_user": {
      "username": "standard_user",
      "password": "secret_sauce"
    }
  },
  "timeout": {
    "default": 30000,
    "navigation": 30000
  },
  "headless": true
}
```

### Creating Custom Profiles

1. Create a new JSON file in `profiles/` directory (e.g., `qa.json`)
2. Copy the structure from an existing profile
3. Update the values as needed
4. Run tests with: `PROFILE=qa npm test`

## Page Object Model

The framework uses the Page Object Model pattern to separate test logic from page interactions.

### Page Object Structure

Each page object class contains:

1. **Locators** - Element selectors defined as class properties
2. **Navigation methods** - Methods to navigate to the page
3. **Action methods** - Methods to interact with page elements
4. **Helper methods** - Methods to retrieve data or verify state

### Example Usage

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductsPage';

test('login and add item to cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);

  // Navigate and login
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');

  // Add item to cart
  await productsPage.addBackpackToCart();

  // Verify cart count
  const cartCount = await productsPage.getCartItemCount();
  expect(cartCount).toBe(1);
});
```

### Available Page Objects

- **LoginPage** - Login page interactions
- **ProductsPage** - Product listing and cart actions
- **CartPage** - Shopping cart management
- **CheckoutPage** - Checkout process (info, overview, complete)

## Writing New Tests

### Test File Naming Conventions

- Regular tests: `*.spec.ts` - Uses authentication state
- No-auth tests: `*.noauth.spec.ts` - Runs without authentication (login tests)

### Test Template

```typescript
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../../src/pages/ProductsPage';

test.describe('Test Suite Name', () => {
  test('Test case description', async ({ page }) => {
    // Arrange - Set up page objects
    const productsPage = new ProductsPage(page);

    // Act - Perform actions
    await productsPage.navigate();
    await productsPage.addBackpackToCart();

    // Assert - Verify expected results
    await expect(productsPage.backpackRemoveButton).toBeVisible();
    const cartCount = await productsPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });
});
```

### Best Practices

1. **Use Page Objects** - Always interact with pages through POM classes
2. **Clear Test Names** - Use descriptive test names that explain what is being tested
3. **Arrange-Act-Assert** - Follow the AAA pattern for test structure
4. **Independent Tests** - Each test should be independent and not rely on other tests
5. **Proper Assertions** - Use Playwright's expect API for reliable assertions
6. **Comments** - Add comments for complex logic or business rules

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright/report/
        retention-days: 30
```

### Environment Variables

Override configuration via environment variables:

```bash
# Override base URL
BASE_URL=https://custom-url.com npm test

# Override credentials
USERNAME=custom_user PASSWORD=custom_pass npm test

# Use specific profile
PROFILE=staging npm test
```

## Test Coverage

Current test coverage includes:

- ✅ Login functionality (1 test)
- ✅ Add items to cart (3 tests)
- ✅ Remove items from cart (3 tests)
- ✅ Checkout process (5 tests)

**Total: 12 automated test cases**

## Troubleshooting

### Common Issues

**Issue: Authentication state not found**
```bash
# Run the setup project first
npm test -- --project=setup
```

**Issue: Tests failing with timeout**
```bash
# Increase timeout in profile or use local profile
PROFILE=local npm test
```

**Issue: Browser not installed**
```bash
# Reinstall browsers
npx playwright install
```

### Debug Mode

Run tests in debug mode:

```bash
# Debug mode with Playwright Inspector
npx playwright test --debug

# Run specific test in debug mode
npx playwright test tests/login-functionality/successful-login.noauth.spec.ts --debug
```

## Contributing

1. Create a new branch for your feature
2. Write tests following the existing patterns
3. Ensure all tests pass: `npm test`
4. Update documentation if needed
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Resources

- [Playwright Documentation](https://playwright.dev)
- [SauceDemo Application](https://www.saucedemo.com)
- [Test Plan](tests/saucedemo.plan.md)
