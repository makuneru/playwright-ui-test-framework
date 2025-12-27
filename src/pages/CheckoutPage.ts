import { Page, Locator } from "@playwright/test";
import { step } from "../utils/decorators/step";

export class CheckoutPage {
  readonly page: Page;

  // Step 1: Your Information - Locators
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;

  // Step 2: Overview - Locators
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly summaryInfo: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;

  // Complete - Locators
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1: Your Information
    this.pageTitle = page
      .locator('[data-test="title"]')
      .describe("Checkout Page Title");
    this.firstNameInput = page
      .locator('[data-test="firstName"]')
      .describe("First Name Input");
    this.lastNameInput = page
      .locator('[data-test="lastName"]')
      .describe("Last Name Input");
    this.postalCodeInput = page
      .locator('[data-test="postalCode"]')
      .describe("Postal Code Input");
    this.continueButton = page
      .locator('[data-test="continue"]')
      .describe("Continue Button");
    this.cancelButton = page
      .locator('[data-test="cancel"]')
      .describe("Cancel Button");
    this.errorMessage = page
      .locator('[data-test="error"]')
      .describe("Error Message");
    this.errorButton = page
      .locator('[data-test="error-button"]')
      .describe("Error Close Button");

    // Step 2: Overview
    this.cartItems = page
      .locator('[data-test="inventory-item"]')
      .describe("Checkout Cart Items");
    this.cartItemNames = page
      .locator('[data-test="inventory-item-name"]')
      .describe("Checkout Cart Item Names");
    this.cartItemPrices = page
      .locator('[data-test="inventory-item-price"]')
      .describe("Checkout Cart Item Prices");
    this.itemTotal = page
      .locator('[data-test="subtotal-label"]')
      .describe("Item Total (Subtotal)");
    this.tax = page.locator('[data-test="tax-label"]').describe("Tax Amount");
    this.total = page
      .locator('[data-test="total-label"]')
      .describe("Total Amount");
    this.finishButton = page
      .locator('[data-test="finish"]')
      .describe("Finish Button");
    this.summaryInfo = page
      .locator('[data-test="payment-info-value"]')
      .describe("Summary Info");
    this.paymentInfo = page
      .locator('[data-test="payment-info-value"]')
      .describe("Payment Info");
    this.shippingInfo = page
      .locator('[data-test="shipping-info-value"]')
      .describe("Shipping Info");

    // Complete
    this.completeHeader = page
      .locator('[data-test="complete-header"]')
      .describe("Order Complete Header");
    this.completeText = page
      .locator('[data-test="complete-text"]')
      .describe("Order Complete Text");
    this.backHomeButton = page
      .locator('[data-test="back-to-products"]')
      .describe("Back to Products Button");
    this.ponyExpressImage = page
      .locator('[data-test="pony-express"]')
      .describe("Pony Express Image");
  }

  // Navigation methods
  @step("Navigate to checkout step one")
  async navigateToStepOne() {
    await this.page.goto("/checkout-step-one.html");
  }

  @step("Navigate to checkout step two")
  async navigateToStepTwo() {
    await this.page.goto("/checkout-step-two.html");
  }

  @step("Navigate to checkout complete page")
  async navigateToComplete() {
    await this.page.goto("/checkout-complete.html");
  }

  // Step 1: Your Information - Action methods
  @step("Fill first name: {0}")
  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  @step("Fill last name: {0}")
  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  @step("Fill postal code: {0}")
  async fillPostalCode(postalCode: string) {
    await this.postalCodeInput.fill(postalCode);
  }

  @step("Fill checkout information - {0} {1}, {2}")
  async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
  }

  @step("Click continue button")
  async clickContinue() {
    await this.continueButton.click();
  }

  @step("Click cancel button")
  async clickCancel() {
    await this.cancelButton.click();
  }

  @step("Complete checkout step one - {0} {1}, {2}")
  async completeStepOne(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.fillCheckoutInformation(firstName, lastName, postalCode);
    await this.clickContinue();
  }

  // Step 2: Overview - Action methods
  @step("Click finish button")
  async clickFinish() {
    await this.finishButton.click();
  }

  @step("Complete checkout")
  async completeCheckout() {
    await this.clickFinish();
  }

  // Complete page - Action methods
  @step("Click back home button")
  async clickBackHome() {
    await this.backHomeButton.click();
  }

  // Helper methods - Step 1
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) || "";
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  @step("Clear error message")
  async clearError() {
    await this.errorButton.click();
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) || "";
  }

  // Helper methods - Step 2 (Overview)
  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    return await this.cartItemPrices.allTextContents();
  }

  async getSubtotal(): Promise<string> {
    const text = (await this.itemTotal.textContent()) || "";
    return text.replace("Item total: $", "");
  }

  async getTax(): Promise<string> {
    const text = (await this.tax.textContent()) || "";
    return text.replace("Tax: $", "");
  }

  async getTotal(): Promise<string> {
    const text = (await this.total.textContent()) || "";
    return text.replace("Total: $", "");
  }

  async getPaymentInfo(): Promise<string> {
    return (await this.paymentInfo.textContent()) || "";
  }

  async getShippingInfo(): Promise<string> {
    return (await this.shippingInfo.textContent()) || "";
  }

  async verifyItemInCheckout(productName: string): Promise<boolean> {
    const items = await this.getItemNames();
    return items.includes(productName);
  }

  // Helper methods - Complete page
  async getCompleteHeader(): Promise<string> {
    return (await this.completeHeader.textContent()) || "";
  }

  async getCompleteText(): Promise<string> {
    return (await this.completeText.textContent()) || "";
  }

  async isOrderComplete(): Promise<boolean> {
    return await this.completeHeader.isVisible();
  }

  async isPonyExpressImageVisible(): Promise<boolean> {
    return await this.ponyExpressImage.isVisible();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
  }
}
