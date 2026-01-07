import { test, expect } from '../../src/fixtures/base';

test.describe('Remove Item from Cart', () => {
  test('Remove item from products page', async ({ page, productsPage }) => {
    // Since this test uses authentication state, the user is already logged in
    // We need to navigate to the products page first

    // Navigate to the products page
    await productsPage.navigate();
    await productsPage.waitForPageLoad();

    // 3. Click the 'Add to cart' button for 'Sauce Labs Bike Light'
    await productsPage.addBikeLightToCart();

    // 4. Verify the button changes to 'Remove' and cart badge shows '1'
    await expect(productsPage.bikeLightRemoveButton).toBeVisible();
    await expect(productsPage.shoppingCartBadge).toHaveText('1');

    // 5. Click the 'Remove' button for 'Sauce Labs Bike Light'
    await productsPage.removeBikeLightFromCart();

    // Expected Results:

    // - The 'Remove' button changes back to 'Add to cart' button
    await expect(productsPage.bikeLightAddToCartButton).toBeVisible();
    await expect(productsPage.bikeLightRemoveButton).not.toBeVisible();

    // - Shopping cart badge in header disappears or shows no count
    await expect(productsPage.shoppingCartBadge).not.toBeVisible();

    // - Product 'Sauce Labs Bike Light' remains visible on the products page
    const bikeLightProduct = page.locator('[data-test="inventory-item"]', {
      has: page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Bike Light' })
    });
    await expect(bikeLightProduct).toBeVisible();
  });
});
