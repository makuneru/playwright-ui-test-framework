import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { CartPage } from '../../src/pages/CartPage';

test.describe('Remove Item from Cart', () => {
  test('Remove one item from cart with multiple items', async ({ page }) => {
    // Since this test uses authentication state, the user is already logged in
    // Initialize page objects
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // 1. Navigate to https://www.saucedemo.com/
    await productsPage.navigate();
    await productsPage.waitForPageLoad();

    // 2. Login with username 'standard_user' and password 'secret_sauce'
    // (Authentication is already handled by the setup project)

    // 3. Add 'Sauce Labs Backpack' to cart
    await productsPage.addBackpackToCart();

    // 4. Add 'Sauce Labs Bike Light' to cart
    await productsPage.addBikeLightToCart();

    // 5. Verify cart badge shows '2'
    await expect(productsPage.shoppingCartBadge).toBeVisible();
    await expect(productsPage.shoppingCartBadge).toHaveText('2');

    // 6. Click on the shopping cart icon
    await productsPage.goToCart();

    // Verify we're on the cart page
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    // 7. Click the 'Remove' button for 'Sauce Labs Backpack'
    await cartPage.removeBackpack();

    // Expected Results:
    
    // - 'Sauce Labs Backpack' is removed from the cart
    const isBackpackInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
    expect(isBackpackInCart).toBe(false);

    // - 'Sauce Labs Bike Light' remains in the cart
    const isBikeLightInCart = await cartPage.isItemInCart('Sauce Labs Bike Light');
    expect(isBikeLightInCart).toBe(true);

    // - Cart badge updates to show '1'
    await expect(cartPage.shoppingCartBadge).toBeVisible();
    await expect(cartPage.shoppingCartBadge).toHaveText('1');

    // - Cart page displays only 'Sauce Labs Bike Light' with quantity '1' and price '$9.99'
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);

    // Verify the remaining item is 'Sauce Labs Bike Light'
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toHaveLength(1);
    expect(itemNames[0]).toBe('Sauce Labs Bike Light');

    // Verify quantity is '1'
    const itemQuantity = cartPage.page.locator('[data-test="inventory-item"]')
      .filter({ has: cartPage.page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Bike Light' }) })
      .locator('[data-test="item-quantity"]');
    await expect(itemQuantity).toHaveText('1');

    // Verify price is '$9.99'
    const bikeLightPrice = await cartPage.getItemPrice('Sauce Labs Bike Light');
    expect(bikeLightPrice).toBe('$9.99');
  });
});
