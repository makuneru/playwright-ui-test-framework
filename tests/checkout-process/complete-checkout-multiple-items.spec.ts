import { test, expect } from '../../src/fixtures/base';

test.describe('Checkout Process', () => {
  test('Complete checkout with multiple items', async ({ page, productsPage, cartPage, checkoutPage }) => {
    // Since this test uses authentication state, the user is already logged in
    // We need to navigate to the products page first

    // 1. Navigate to https://www.saucedemo.com/ (user is already logged in via auth state)
    // 2. Login with username 'standard_user' and password 'secret_sauce' (already authenticated)
    await productsPage.navigate();
    await productsPage.waitForPageLoad();

    // 3. Add 'Sauce Labs Backpack' ($29.99) to cart
    await productsPage.addBackpackToCart();
    await expect(productsPage.backpackRemoveButton).toBeVisible();
    await expect(productsPage.shoppingCartBadge).toHaveText('1');

    // 4. Add 'Sauce Labs Bike Light' ($9.99) to cart
    await productsPage.addBikeLightToCart();
    await expect(productsPage.bikeLightRemoveButton).toBeVisible();
    await expect(productsPage.shoppingCartBadge).toHaveText('2');

    // 5. Add 'Sauce Labs Bolt T-Shirt' ($15.99) to cart
    await productsPage.addBoltTShirtToCart();
    await expect(productsPage.boltTShirtRemoveButton).toBeVisible();
    await expect(productsPage.shoppingCartBadge).toHaveText('3');

    // 6. Click on the shopping cart icon
    await productsPage.goToCart();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    // 7. Verify all three items are displayed in the cart
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');
    expect(itemNames).toContain('Sauce Labs Bolt T-Shirt');
    
    // Verify item count
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(3);

    // Verify prices for each item
    const backpackPrice = await cartPage.getItemPrice('Sauce Labs Backpack');
    expect(backpackPrice).toBe('$29.99');
    
    const bikeLightPrice = await cartPage.getItemPrice('Sauce Labs Bike Light');
    expect(bikeLightPrice).toBe('$9.99');
    
    const boltTShirtPrice = await cartPage.getItemPrice('Sauce Labs Bolt T-Shirt');
    expect(boltTShirtPrice).toBe('$15.99');

    // 8. Click the 'Checkout' button
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Your Information');

    // 9. Enter 'Jane' in the First Name field
    await checkoutPage.fillFirstName('Jane');

    // 10. Enter 'Smith' in the Last Name field
    await checkoutPage.fillLastName('Smith');

    // 11. Enter '67890' in the Zip/Postal Code field
    await checkoutPage.fillPostalCode('67890');

    // 12. Click the 'Continue' button
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Overview');

    // 13. Verify all items and correct total on checkout overview page
    // Expected Result: Checkout overview shows all three items with correct prices
    const orderItemNames = await checkoutPage.getItemNames();
    expect(orderItemNames).toContain('Sauce Labs Backpack');
    expect(orderItemNames).toContain('Sauce Labs Bike Light');
    expect(orderItemNames).toContain('Sauce Labs Bolt T-Shirt');

    const orderItemPrices = await checkoutPage.getItemPrices();
    expect(orderItemPrices).toContain('$29.99');
    expect(orderItemPrices).toContain('$9.99');
    expect(orderItemPrices).toContain('$15.99');

    // Expected Result: Item total is calculated correctly: $55.97 ($29.99 + $9.99 + $15.99)
    const subtotal = await checkoutPage.getSubtotal();
    expect(subtotal).toBe('55.97');

    // Expected Result: Tax is calculated and displayed
    const tax = await checkoutPage.getTax();
    expect(parseFloat(tax)).toBeGreaterThan(0);

    // Expected Result: Total amount includes item total plus tax
    const total = await checkoutPage.getTotal();
    const expectedTotal = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
    expect(total).toBe(expectedTotal);

    // Verify payment and shipping information
    const paymentInfo = await checkoutPage.getPaymentInfo();
    expect(paymentInfo).toBe('SauceCard #31337');

    const shippingInfo = await checkoutPage.getShippingInfo();
    expect(shippingInfo).toBe('Free Pony Express Delivery!');

    // 14. Click the 'Finish' button
    await checkoutPage.clickFinish();

    // Expected Result: After clicking 'Finish', user is redirected to confirmation page
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Complete!');

    // Expected Result: Order completion page displays success message
    const completeHeader = await checkoutPage.getCompleteHeader();
    expect(completeHeader).toBe('Thank you for your order!');

    // Expected Result: Pony Express image is displayed
    await expect(checkoutPage.ponyExpressImage).toBeVisible();

    // Expected Result: 'Back Home' button is visible
    await expect(checkoutPage.backHomeButton).toBeVisible();

    // Expected Result: Cart badge is cleared after successful checkout
    // Navigate back to products page to verify cart is empty
    await checkoutPage.clickBackHome();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Cart badge should not be visible (0 items)
    const isCartBadgeVisible = await productsPage.shoppingCartBadge.isVisible();
    expect(isCartBadgeVisible).toBe(false);
  });
});
