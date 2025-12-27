import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';

test.describe('Checkout Process', () => {
  test('Return to products after successful checkout', async ({ page }) => {
    // Since this test uses authentication state, the user is already logged in
    // We need to navigate to the products page first
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Navigate to https://www.saucedemo.com/
    // 2. Login with username 'standard_user' and password 'secret_sauce'
    // User is already logged in via auth state, navigate to products page
    await productsPage.navigate();
    await productsPage.waitForPageLoad();

    // 3. Add 'Sauce Labs Onesie' to cart
    await productsPage.addOnesieToCart();

    // Verify the item was added (Remove button should be visible)
    await expect(productsPage.onesieRemoveButton).toBeVisible();

    // Verify cart badge shows '1' item
    await expect(productsPage.shoppingCartBadge).toHaveText('1');

    // Navigate to cart
    await productsPage.goToCart();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // 4. Complete checkout process with First Name: 'Test', Last Name: 'User', Zip: '11111'
    await checkoutPage.fillCheckoutInformation('Test', 'User', '11111');
    await checkoutPage.clickContinue();

    // Verify checkout overview page
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Overview');

    // Click Finish to complete checkout
    await checkoutPage.clickFinish();

    // 5. Verify checkout completion page is displayed
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Complete!');
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.backHomeButton).toBeVisible();

    // 6. Click the 'Back Home' button
    await checkoutPage.clickBackHome();

    // Expected Result: User is redirected to the products page (URL: https://www.saucedemo.com/inventory.html)
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Expected Result: Products page displays all 6 products
    await productsPage.waitForPageLoad();
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBe(6);

    // Expected Result: Shopping cart is empty (no badge visible or badge shows '0')
    const cartBadgeVisible = await productsPage.shoppingCartBadge.isVisible();
    if (cartBadgeVisible) {
      const cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe(0);
    } else {
      // Badge is not visible, which is expected for empty cart
      expect(cartBadgeVisible).toBe(false);
    }

    // Expected Result: All products show 'Add to cart' buttons (not 'Remove')
    await expect(productsPage.backpackAddToCartButton).toBeVisible();
    await expect(productsPage.bikeLightAddToCartButton).toBeVisible();
    await expect(productsPage.boltTShirtAddToCartButton).toBeVisible();
    await expect(productsPage.fleeceJacketAddToCartButton).toBeVisible();
    await expect(productsPage.onesieAddToCartButton).toBeVisible();
    await expect(productsPage.redTShirtAddToCartButton).toBeVisible();

    // Verify Remove buttons are not visible
    await expect(productsPage.backpackRemoveButton).not.toBeVisible();
    await expect(productsPage.bikeLightRemoveButton).not.toBeVisible();
    await expect(productsPage.boltTShirtRemoveButton).not.toBeVisible();
    await expect(productsPage.fleeceJacketRemoveButton).not.toBeVisible();
    await expect(productsPage.onesieRemoveButton).not.toBeVisible();
    await expect(productsPage.redTShirtRemoveButton).not.toBeVisible();

    // Expected Result: User can continue shopping normally
    // Test by adding an item to cart
    await productsPage.addBackpackToCart();
    await expect(productsPage.backpackRemoveButton).toBeVisible();
    await expect(productsPage.shoppingCartBadge).toHaveText('1');
  });
});
