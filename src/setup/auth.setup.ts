import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { getBaseUrl, getCredentials } from "../utils/config";
import path from "path";

const authFile = path.join(__dirname, "../../.auth/user.json");

setup("authenticate as standard user", async ({ page }) => {
  const baseUrl = getBaseUrl();
  const credentials = getCredentials("standard_user");

  // Navigate to login page
  await page.goto(baseUrl);

  // Create login page instance
  const loginPage = new LoginPage(page);

  // Perform login
  await loginPage.login(credentials.username, credentials.password);

  // Wait for navigation to products page
  await page.waitForURL("**/inventory.html");

  // Verify login was successful
  const productsPage = new ProductsPage(page);
  await expect(productsPage.pageTitle).toBeVisible();
  await expect(productsPage.pageTitle).toHaveText("Products");

  // Save authentication state
  await page.context().storageState({ path: authFile });

  console.log("✓ Authentication successful and state saved");
});
