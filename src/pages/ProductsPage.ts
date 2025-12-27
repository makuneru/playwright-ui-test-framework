import { Page, Locator } from "@playwright/test";
import { step } from "../utils/decorators/step";

export class ProductsPage {
  readonly page: Page;

  // Locators
  readonly pageTitle: Locator;
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly productSortDropdown: Locator;

  // Product-specific locators (common products)
  readonly backpackAddToCartButton: Locator;
  readonly backpackRemoveButton: Locator;
  readonly bikeLightAddToCartButton: Locator;
  readonly bikeLightRemoveButton: Locator;
  readonly boltTShirtAddToCartButton: Locator;
  readonly boltTShirtRemoveButton: Locator;
  readonly fleeceJacketAddToCartButton: Locator;
  readonly fleeceJacketRemoveButton: Locator;
  readonly onesieAddToCartButton: Locator;
  readonly onesieRemoveButton: Locator;
  readonly redTShirtAddToCartButton: Locator;
  readonly redTShirtRemoveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.pageTitle = page.locator('[data-test="title"]').describe("Page Title");
    this.inventoryContainer = page
      .locator('[data-test="inventory-container"]')
      .describe("Inventory Container");
    this.inventoryItems = page
      .locator('[data-test="inventory-item"]')
      .describe("Inventory Items");
    this.shoppingCartLink = page
      .locator('[data-test="shopping-cart-link"]')
      .describe("Shopping Cart Link");
    this.shoppingCartBadge = page
      .locator('[data-test="shopping-cart-badge"]')
      .describe("Shopping Cart Badge");
    this.menuButton = page
      .locator("#react-burger-menu-btn")
      .describe("Menu Button");
    this.logoutLink = page
      .locator("#logout_sidebar_link")
      .describe("Logout Link");
    this.productSortDropdown = page
      .locator('[data-test="product-sort-container"]')
      .describe("Product Sort Dropdown");

    // Product-specific buttons
    this.backpackAddToCartButton = page
      .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
      .describe("Backpack - Add to Cart Button");
    this.backpackRemoveButton = page
      .locator('[data-test="remove-sauce-labs-backpack"]')
      .describe("Backpack - Remove Button");
    this.bikeLightAddToCartButton = page
      .locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .describe("Bike Light - Add to Cart Button");
    this.bikeLightRemoveButton = page
      .locator('[data-test="remove-sauce-labs-bike-light"]')
      .describe("Bike Light - Remove Button");
    this.boltTShirtAddToCartButton = page
      .locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')
      .describe("Bolt T-Shirt - Add to Cart Button");
    this.boltTShirtRemoveButton = page
      .locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')
      .describe("Bolt T-Shirt - Remove Button");
    this.fleeceJacketAddToCartButton = page
      .locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')
      .describe("Fleece Jacket - Add to Cart Button");
    this.fleeceJacketRemoveButton = page
      .locator('[data-test="remove-sauce-labs-fleece-jacket"]')
      .describe("Fleece Jacket - Remove Button");
    this.onesieAddToCartButton = page
      .locator('[data-test="add-to-cart-sauce-labs-onesie"]')
      .describe("Onesie - Add to Cart Button");
    this.onesieRemoveButton = page
      .locator('[data-test="remove-sauce-labs-onesie"]')
      .describe("Onesie - Remove Button");
    this.redTShirtAddToCartButton = page
      .locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]')
      .describe("Red T-Shirt - Add to Cart Button");
    this.redTShirtRemoveButton = page
      .locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]')
      .describe("Red T-Shirt - Remove Button");
  }

  // Navigation methods
  @step("Navigate to products page")
  async navigate() {
    await this.page.goto("/inventory.html");
  }

  @step("Go to cart")
  async goToCart() {
    await this.shoppingCartLink.click();
  }

  @step("Open menu")
  async openMenu() {
    await this.menuButton.click();
  }

  @step("Logout")
  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  // Action methods for adding items to cart
  @step("Add Sauce Labs Backpack to cart")
  async addBackpackToCart() {
    await this.backpackAddToCartButton.click();
  }

  @step("Add Sauce Labs Bike Light to cart")
  async addBikeLightToCart() {
    await this.bikeLightAddToCartButton.click();
  }

  @step("Add Sauce Labs Bolt T-Shirt to cart")
  async addBoltTShirtToCart() {
    await this.boltTShirtAddToCartButton.click();
  }

  @step("Add Sauce Labs Fleece Jacket to cart")
  async addFleeceJacketToCart() {
    await this.fleeceJacketAddToCartButton.click();
  }

  @step("Add Sauce Labs Onesie to cart")
  async addOnesieToCart() {
    await this.onesieAddToCartButton.click();
  }

  @step("Add Test.allTheThings() T-Shirt (Red) to cart")
  async addRedTShirtToCart() {
    await this.redTShirtAddToCartButton.click();
  }

  // Generic method to add item by product name (converted to data-test format)
  @step("Add item to cart: {0}")
  async addItemToCart(productName: string) {
    const dataTestId = this.convertProductNameToDataTest(productName);
    await this.page.locator(`[data-test="add-to-cart-${dataTestId}"]`).click();
  }

  // Action methods for removing items from cart
  @step("Remove Sauce Labs Backpack from cart")
  async removeBackpackFromCart() {
    await this.backpackRemoveButton.click();
  }

  @step("Remove Sauce Labs Bike Light from cart")
  async removeBikeLightFromCart() {
    await this.bikeLightRemoveButton.click();
  }

  @step("Remove Sauce Labs Bolt T-Shirt from cart")
  async removeBoltTShirtFromCart() {
    await this.boltTShirtRemoveButton.click();
  }

  @step("Remove Sauce Labs Fleece Jacket from cart")
  async removeFleeceJacketFromCart() {
    await this.fleeceJacketRemoveButton.click();
  }

  @step("Remove Sauce Labs Onesie from cart")
  async removeOnesieFromCart() {
    await this.onesieRemoveButton.click();
  }

  @step("Remove Test.allTheThings() T-Shirt (Red) from cart")
  async removeRedTShirtFromCart() {
    await this.redTShirtRemoveButton.click();
  }

  // Generic method to remove item by product name
  @step("Remove item from cart: {0}")
  async removeItemFromCart(productName: string) {
    const dataTestId = this.convertProductNameToDataTest(productName);
    await this.page.locator(`[data-test="remove-${dataTestId}"]`).click();
  }

  // Sorting methods
  @step("Sort products by: {0}")
  async sortBy(option: "az" | "za" | "lohi" | "hilo") {
    await this.productSortDropdown.selectOption(option);
  }

  @step("Click product name: {0}")
  async clickProductName(productName: string) {
    await this.page
      .locator(`[data-test="inventory-item-name"]`, { hasText: productName })
      .click();
  }

  // Helper methods
  async getCartItemCount(): Promise<number> {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) return 0;
    const count = await this.shoppingCartBadge.textContent();
    return parseInt(count || "0");
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) || "";
  }

  async getProductCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async isProductAddedToCart(productName: string): Promise<boolean> {
    const dataTestId = this.convertProductNameToDataTest(productName);
    const removeButton = this.page.locator(
      `[data-test="remove-${dataTestId}"]`
    );
    return await removeButton.isVisible();
  }

  async getProductPrice(productName: string): Promise<string> {
    const itemDiv = this.page.locator(`[data-test="inventory-item"]`, {
      has: this.page.locator(`[data-test="inventory-item-name"]`, {
        hasText: productName,
      }),
    });
    const priceElement = itemDiv.locator('[data-test="inventory-item-price"]');
    return (await priceElement.textContent()) || "";
  }

  // Utility method to convert product names to data-test format
  private convertProductNameToDataTest(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, "-");
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.inventoryContainer.waitFor({ state: "visible" });
  }
}
