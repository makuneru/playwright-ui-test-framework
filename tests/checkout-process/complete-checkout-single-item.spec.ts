import { test, expect } from '../../src/fixtures/base';

test.describe('Checkout Process', () => {
  test('Complete checkout with single item', async ({ page, productsPage, cartPage, checkoutPage }) => {
    // Since this test uses authentication state, the user is already logged in
    // We need to navigate to the products page first

    // Navigate to the products page (user is already logged in via auth state)
    await productsPage.navigate();
    await productsPage.waitForPageLoad();

    // 3. Click the 'Add to cart' button for 'Sauce Labs Backpack'
    await productsPage.addBackpackToCart();

    // Verify the item was added (Remove button should be visible)
    await expect(productsPage.backpackRemoveButton).toBeVisible();

    // Verify cart badge shows '1' item
    await expect(productsPage.shoppingCartBadge).toHaveText('1');

    // 4. Click on the shopping cart icon
    await productsPage.goToCart();

    // 5. Verify 'Sauce Labs Backpack' is in the cart
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    
    const isBackpackInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
    expect(isBackpackInCart).toBe(true);

    // Verify quantity
    const itemQuantity = page.locator('[data-test="inventory-item"]')
      .filter({ has: page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Backpack' }) })
      .locator('[data-test="item-quantity"]');
    await expect(itemQuantity).toHaveText('1');

    // Verify price
    const backpackPrice = await cartPage.getItemPrice('Sauce Labs Backpack');
    expect(backpackPrice).toBe('$29.99');

    // 6. Click the 'Checkout' button
    await cartPage.proceedToCheckout();

    // Expected Result: After clicking 'Checkout', user is redirected to checkout step one
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // Expected Result: Page displays 'Checkout: Your Information' heading
    await expect(checkoutPage.pageTitle).toBeVisible();
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Your Information');

    // 7. Enter 'John' in the First Name field
    await checkoutPage.fillFirstName('John');

    // 8. Enter 'Doe' in the Last Name field
    await checkoutPage.fillLastName('Doe');

    // 9. Enter '12345' in the Zip/Postal Code field
    await checkoutPage.fillPostalCode('12345');

    // 10. Click the 'Continue' button
    await checkoutPage.clickContinue();

    // Expected Result: After clicking 'Continue', user is redirected to checkout step two
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

    // Expected Result: Checkout overview page displays 'Checkout: Overview' heading
    await expect(checkoutPage.pageTitle).toBeVisible();
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Overview');

    // 11. Verify the checkout overview page displays the correct information

    // Expected Result: Order summary shows 'Sauce Labs Backpack' with quantity '1' and price '$29.99'
    const orderItemNames = await checkoutPage.getItemNames();
    expect(orderItemNames).toContain('Sauce Labs Backpack');

    const orderItemQuantity = page.locator('[data-test="inventory-item"]')
      .filter({ has: page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Backpack' }) })
      .locator('.cart_quantity');
    await expect(orderItemQuantity).toHaveText('1');

    const orderItemPrices = await checkoutPage.getItemPrices();
    expect(orderItemPrices[0]).toBe('$29.99');

    // Expected Result: Payment information shows 'SauceCard #31337'
    const paymentInfo = await checkoutPage.getPaymentInfo();
    expect(paymentInfo).toBe('SauceCard #31337');

    // Expected Result: Shipping information shows 'Free Pony Express Delivery!'
    const shippingInfo = await checkoutPage.getShippingInfo();
    expect(shippingInfo).toBe('Free Pony Express Delivery!');

    // Expected Result: Price breakdown displays: Item total: $29.99, Tax: $2.40, Total: $32.39
    const subtotal = await checkoutPage.getSubtotal();
    expect(subtotal).toBe('29.99');

    const tax = await checkoutPage.getTax();
    expect(tax).toBe('2.40');

    const total = await checkoutPage.getTotal();
    expect(total).toBe('32.39');

    // 12. Click the 'Finish' button
    await checkoutPage.clickFinish();

    // Expected Result: After clicking 'Finish', user is redirected to confirmation page
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');

    // Expected Result: Confirmation page displays 'Checkout: Complete!' heading
    await expect(checkoutPage.pageTitle).toBeVisible();
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Complete!');

    // Expected Result: Success message shows 'Thank you for your order!'
    const completeHeader = await checkoutPage.getCompleteHeader();
    expect(completeHeader).toBe('Thank you for your order!');

    // Expected Result: Pony Express image is displayed
    await expect(checkoutPage.ponyExpressImage).toBeVisible();

    // Expected Result: 'Back Home' button is visible
    await expect(checkoutPage.backHomeButton).toBeVisible();
  });
});
