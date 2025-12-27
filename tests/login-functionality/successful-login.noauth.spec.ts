import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductsPage } from '../../src/pages/ProductsPage';

test.describe('Login Functionality', () => {
  test('Successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    // 1. Navigate to https://www.saucedemo.com/
    await loginPage.navigate();

    // 2. Verify the login page is displayed with username field, password field, and login button
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // 3. Enter 'standard_user' in the username field
    await loginPage.fillUsername('standard_user');

    // 4. Enter 'secret_sauce' in the password field
    await loginPage.fillPassword('secret_sauce');

    // 5. Click the 'Login' button
    await loginPage.clickLogin();

    // Expected Results:
    // - User is redirected to the products/inventory page (URL: https://www.saucedemo.com/inventory.html)
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // - The page displays 'Products' heading
    await expect(productsPage.pageTitle).toBeVisible();
    await expect(productsPage.pageTitle).toHaveText('Products');

    // - Product grid is visible showing 6 products
    await expect(productsPage.inventoryContainer).toBeVisible();
    await expect(productsPage.inventoryItems).toHaveCount(6);

    // - Shopping cart icon is visible in the header
    await expect(productsPage.shoppingCartLink).toBeVisible();

    // - Hamburger menu button is visible
    await expect(productsPage.menuButton).toBeVisible();
  });
});
