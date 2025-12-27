import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { CartPage } from '../../src/pages/CartPage';

test.describe('Remove Item from Cart', () => {
  test('Remove item from cart page', async ({ page }) => {
    // Since this test uses authentication state, the user is already logged in
    // We need to navigate to the products page first
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Navigate to the products page
    await productsPage.navigate();
    await productsPage.waitForPageLoad();

    // 3. Click the 'Add to cart' button for 'Sauce Labs Backpack'
    await productsPage.addBackpackToCart();

    // Verify the item was added (Remove button should be visible)
    await expect(productsPage.backpackRemoveButton).toBeVisible();

    // Verify cart badge shows '1' item
    await expect(productsPage.shoppingCartBadge).toHaveText('1');

    // 4. Click on the shopping cart icon to view the cart
    await productsPage.goToCart();

    // Wait for cart page to load
    await cartPage.waitForPageLoad();

    // 5. Verify 'Sauce Labs Backpack' is displayed in the cart
    const isBackpackInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
    expect(isBackpackInCart).toBe(true);

    // Verify the page title
    await expect(cartPage.pageTitle).toBeVisible();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    // Verify the backpack remove button is visible
    await expect(cartPage.backpackRemoveButton).toBeVisible();

    // 6. Click the 'Remove' button for 'Sauce Labs Backpack'
    await cartPage.removeBackpack();

    // Expected Results:

    // - The 'Sauce Labs Backpack' is removed from the cart
    const isBackpackStillInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
    expect(isBackpackStillInCart).toBe(false);

    // - Cart displays no items (empty cart state)
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);

    // Verify cart item count is 0
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(0);

    // - Shopping cart badge in header disappears or shows no count
    await expect(cartPage.shoppingCartBadge).not.toBeVisible();

    // - 'Continue Shopping' and 'Checkout' buttons remain visible
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
