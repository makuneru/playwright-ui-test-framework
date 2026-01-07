import { test, expect } from '../../src/fixtures/base';

test.describe('Add Item to Cart', () => {
  test('Verify cart contents after adding item', async ({ page, productsPage, cartPage }) => {
    // Since this test uses authentication state, the user is already logged in
    // We need to navigate to the products page first

    // Navigate to the products page
    await productsPage.navigate();
    await productsPage.waitForPageLoad();

    // 3. Click the 'Add to cart' button for 'Sauce Labs Backpack'
    await productsPage.addBackpackToCart();

    // Verify the item was added (Remove button should be visible)
    await expect(productsPage.backpackRemoveButton).toBeVisible();

    // Verify cart badge shows '1' item
    await expect(productsPage.shoppingCartBadge).toHaveText('1');

    // 4. Click on the shopping cart icon in the header
    await productsPage.goToCart();

    // Expected Results:
    
    // - User is redirected to the cart page (URL: https://www.saucedemo.com/cart.html)
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // - Page displays 'Your Cart' heading
    await expect(cartPage.pageTitle).toBeVisible();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    // - Cart shows 'Sauce Labs Backpack' with quantity '1'
    const isBackpackInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
    expect(isBackpackInCart).toBe(true);

    // Verify quantity
    const itemQuantity = cartPage.page.locator('[data-test="inventory-item"]')
      .filter({ has: cartPage.page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Backpack' }) })
      .locator('[data-test="item-quantity"]');
    await expect(itemQuantity).toHaveText('1');

    // - Product price is displayed as '$29.99'
    const backpackPrice = await cartPage.getItemPrice('Sauce Labs Backpack');
    expect(backpackPrice).toBe('$29.99');

    // - 'Remove' button is visible for the product
    await expect(cartPage.backpackRemoveButton).toBeVisible();

    // - 'Continue Shopping' and 'Checkout' buttons are visible
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
