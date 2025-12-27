import { test, expect } from '../../src/fixtures/base';

test.describe('Add Item to Cart', () => {
  test('Add multiple products to cart', async ({ loginPage, productsPage }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await loginPage.navigate('https://www.saucedemo.com/');

    // 2. Login with username 'standard_user' and password 'secret_sauce'
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.page.waitForURL('**/inventory.html');

    // Verify we're on the products page
    await expect(productsPage.pageTitle).toBeVisible();
    await expect(productsPage.pageTitle).toHaveText('Products');

    // 3. Click the 'Add to cart' button for 'Sauce Labs Backpack'
    await productsPage.addBackpackToCart();

    // Verify: Button changes from 'Add to cart' to 'Remove'
    await expect(productsPage.backpackRemoveButton).toBeVisible();
    await expect(productsPage.backpackAddToCartButton).not.toBeVisible();

    // Verify: Shopping cart badge shows '1'
    await expect(productsPage.shoppingCartBadge).toBeVisible();
    await expect(productsPage.shoppingCartBadge).toHaveText('1');

    // 4. Click the 'Add to cart' button for 'Sauce Labs Bike Light'
    await productsPage.addBikeLightToCart();

    // Verify: Button changes from 'Add to cart' to 'Remove'
    await expect(productsPage.bikeLightRemoveButton).toBeVisible();
    await expect(productsPage.bikeLightAddToCartButton).not.toBeVisible();

    // Verify: Shopping cart badge shows '2'
    await expect(productsPage.shoppingCartBadge).toHaveText('2');

    // 5. Click the 'Add to cart' button for 'Sauce Labs Bolt T-Shirt'
    await productsPage.addBoltTShirtToCart();

    // Verify: Button changes from 'Add to cart' to 'Remove'
    await expect(productsPage.boltTShirtRemoveButton).toBeVisible();
    await expect(productsPage.boltTShirtAddToCartButton).not.toBeVisible();

    // Verify: Shopping cart badge shows '3'
    await expect(productsPage.shoppingCartBadge).toHaveText('3');

    // Final verification: All three products remain visible with 'Remove' buttons
    await expect(productsPage.backpackRemoveButton).toBeVisible();
    await expect(productsPage.bikeLightRemoveButton).toBeVisible();
    await expect(productsPage.boltTShirtRemoveButton).toBeVisible();

    // Verify cart count is 3
    const cartCount = await productsPage.getCartItemCount();
    expect(cartCount).toBe(3);
  });
});
