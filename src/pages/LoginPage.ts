import { Page, Locator } from "@playwright/test";
import { step } from "../utils/decorators/step";

export class LoginPage {
  readonly page: Page;

  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.usernameInput = page
      .locator('[data-test="username"]')
      .describe("Username Input");
    this.passwordInput = page
      .locator('[data-test="password"]')
      .describe("Password Input");
    this.loginButton = page
      .locator('[data-test="login-button"]')
      .describe("Login Button");
    this.errorMessage = page
      .locator('[data-test="error"]')
      .describe("Error Message");
    this.errorButton = page
      .locator('[data-test="error-button"]')
      .describe("Error Close Button");
  }

  // Navigation methods
  @step("Navigate to login page")
  async navigate(url?: string) {
    await this.page.goto(url || "/");
  }

  // Action methods
  @step("Login with username: {0} and password: {1}")
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  @step("Fill username: {0}")
  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  @step("Fill password")
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  @step("Click login button")
  async clickLogin() {
    await this.loginButton.click();
  }

  @step("Clear error message")
  async clearError() {
    await this.errorButton.click();
  }

  // Helper methods for verification
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) || "";
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
  }
}
