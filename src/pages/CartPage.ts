import { Page, Locator } from "@playwright/test";
import { step } from "../utils/decorators/step";

export class CartPage {
  readonly page: Page;

  // Locators
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemQuantities: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly shoppingCartBadge: Locator;

  // Remove buttons for specific products
  readonly backpackRemoveButton: Locator;
  readonly bikeLightRemoveButton: Locator;
  readonly boltTShirtRemoveButton: Locator;
  readonly fleeceJacketRemoveButton: Locator;
  readonly onesieRemoveButton: Locator;
  readonly redTShirtRemoveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.pageTitle = page
      .locator('[data-test="title"]')
      .describe("Cart Page Title");
    this.cartItems = page
      .locator('[data-test="inventory-item"]')
      .describe("Cart Items");
    this.cartItemNames = page
      .locator('[data-test="inventory-item-name"]')
      .describe("Cart Item Names");
    this.cartItemPrices = page
      .locator('[data-test="inventory-item-price"]')
      .describe("Cart Item Prices");
    this.cartItemQuantities = page
      .locator('[data-test="item-quantity"]')
      .describe("Cart Item Quantities");
    this.continueShoppingButton = page
      .locator('[data-test="continue-shopping"]')
      .describe("Continue Shopping Button");
    this.checkoutButton = page
      .locator('[data-test="checkout"]')
      .describe("Checkout Button");
    this.shoppingCartBadge = page
      .locator('[data-test="shopping-cart-badge"]')
      .describe("Shopping Cart Badge");

    // Remove buttons
    this.backpackRemoveButton = page
      .locator('[data-test="remove-sauce-labs-backpack"]')
      .describe("Backpack - Remove Button");
    this.bikeLightRemoveButton = page
      .locator('[data-test="remove-sauce-labs-bike-light"]')
      .describe("Bike Light - Remove Button");
    this.boltTShirtRemoveButton = page
      .locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')
      .describe("Bolt T-Shirt - Remove Button");
    this.fleeceJacketRemoveButton = page
      .locator('[data-test="remove-sauce-labs-fleece-jacket"]')
      .describe("Fleece Jacket - Remove Button");
    this.onesieRemoveButton = page
      .locator('[data-test="remove-sauce-labs-onesie"]')
      .describe("Onesie - Remove Button");
    this.redTShirtRemoveButton = page
      .locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]')
      .describe("Red T-Shirt - Remove Button");
  }

  // Navigation methods
  @step("Navigate to cart page")
  async navigate() {
    await this.page.goto("/cart.html");
  }

  @step("Continue shopping")
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  @step("Proceed to checkout")
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  // Action methods - Remove specific items
  @step("Remove Sauce Labs Backpack from cart")
  async removeBackpack() {
    await this.backpackRemoveButton.click();
  }

  @step("Remove Sauce Labs Bike Light from cart")
  async removeBikeLight() {
    await this.bikeLightRemoveButton.click();
  }

  @step("Remove Sauce Labs Bolt T-Shirt from cart")
  async removeBoltTShirt() {
    await this.boltTShirtRemoveButton.click();
  }

  @step("Remove Sauce Labs Fleece Jacket from cart")
  async removeFleeceJacket() {
    await this.fleeceJacketRemoveButton.click();
  }

  @step("Remove Sauce Labs Onesie from cart")
  async removeOnesie() {
    await this.onesieRemoveButton.click();
  }

  @step("Remove Test.allTheThings() T-Shirt (Red) from cart")
  async removeRedTShirt() {
    await this.redTShirtRemoveButton.click();
  }

  // Generic method to remove item by product name
  @step("Remove item: {0}")
  async removeItem(productName: string) {
    const dataTestId = this.convertProductNameToDataTest(productName);
    await this.page.locator(`[data-test="remove-${dataTestId}"]`).click();
  }

  // Remove item by index
  @step("Remove item at index: {0}")
  async removeItemByIndex(index: number) {
    const removeButtons = this.page.locator('button[id^="remove-"]');
    await removeButtons.nth(index).click();
  }

  // Helper methods
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartBadgeCount(): Promise<number> {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) return 0;
    const count = await this.shoppingCartBadge.textContent();
    return parseInt(count || "0");
  }

  async getItemNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    return await this.cartItemPrices.allTextContents();
  }

  async isItemInCart(productName: string): Promise<boolean> {
    const items = await this.getItemNames();
    return items.includes(productName);
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) || "";
  }

  async isCartEmpty(): Promise<boolean> {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  async getTotalItemsQuantity(): Promise<number> {
    const quantities = await this.cartItemQuantities.allTextContents();
    return quantities.reduce((sum, qty) => sum + parseInt(qty), 0);
  }

  async getItemPrice(productName: string): Promise<string> {
    const itemDiv = this.page.locator(`[data-test="inventory-item"]`, {
      has: this.page.locator(`[data-test="inventory-item-name"]`, {
        hasText: productName,
      }),
    });
    const priceElement = itemDiv.locator('[data-test="inventory-item-price"]');
    return (await priceElement.textContent()) || "";
  }

  @step("Click item name: {0}")
  async clickItemName(productName: string) {
    await this.page
      .locator(`[data-test="inventory-item-name"]`, { hasText: productName })
      .click();
  }

  // Utility method to convert product names to data-test format
  private convertProductNameToDataTest(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, "-");
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
  }
}
