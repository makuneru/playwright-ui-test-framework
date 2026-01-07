import { test, expect } from '../../src/fixtures/base';

test.describe('Checkout Process', () => {
  test('Cancel checkout from overview page', async ({ page, productsPage, cartPage, checkoutPage }) => {
    // Since this test uses authentication state, the user is already logged in
    // We need to navigate to the products page first

    // 1. Navigate to https://www.saucedemo.com/
    // User is already authenticated via auth state, so we navigate to the products page
    await productsPage.navigate();
    await productsPage.waitForPageLoad();

    // 2. Login with username 'standard_user' and password 'secret_sauce'
    // Already handled by authentication state

    // 3. Add 'Test.allTheThings() T-Shirt (Red)' to cart
    await productsPage.addRedTShirtToCart();

    // Verify the item was added (Remove button should be visible)
    await expect(productsPage.redTShirtRemoveButton).toBeVisible();

    // Verify cart badge shows '1' item
    await expect(productsPage.shoppingCartBadge).toHaveText('1');

    // 4. Navigate to cart and click 'Checkout'
    await productsPage.goToCart();

    // Verify we're on the cart page
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    // Verify the Red T-Shirt is in the cart
    const isRedTShirtInCart = await cartPage.isItemInCart('Test.allTheThings() T-Shirt (Red)');
    expect(isRedTShirtInCart).toBe(true);

    // Click Checkout button
    await cartPage.proceedToCheckout();

    // Verify we're on checkout step one
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Your Information');

    // 5. Fill in checkout information: First Name: 'Cancel', Last Name: 'Test', Zip: '99999'
    await checkoutPage.fillFirstName('Cancel');
    await checkoutPage.fillLastName('Test');
    await checkoutPage.fillPostalCode('99999');

    // 6. Click 'Continue' to reach checkout overview page
    await checkoutPage.clickContinue();

    // Verify we're on checkout overview page
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Overview');

    // Verify the Red T-Shirt is shown in the overview
    const orderItemNames = await checkoutPage.getItemNames();
    expect(orderItemNames).toContain('Test.allTheThings() T-Shirt (Red)');

    // 7. Click the 'Cancel' button on the overview page
    await checkoutPage.clickCancel();

    // Expected Results:
    // - User is redirected back to the products page (URL: https://www.saucedemo.com/inventory.html)
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // - Cart badge still shows '1' (item remains in cart)
    await expect(productsPage.shoppingCartBadge).toBeVisible();
    await expect(productsPage.shoppingCartBadge).toHaveText('1');

    // - Order is not completed (we should not be on the complete page)
    expect(page.url()).not.toContain('checkout-complete.html');

    // - User can access cart to see 'Test.allTheThings() T-Shirt (Red)' still present
    await productsPage.goToCart();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    
    const isStillInCart = await cartPage.isItemInCart('Test.allTheThings() T-Shirt (Red)');
    expect(isStillInCart).toBe(true);

    // Verify cart still has 1 item
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
  });
});
