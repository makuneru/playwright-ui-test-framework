import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { getBaseUrl } from "../utils/config";
import path from "path";

const authFile = path.join(__dirname, "../../.auth/user.json");

setup("authenticate as standard user", async ({ page }) => {
  // Get credentials from environment variables (GitHub Secrets) or use defaults
  const username = process.env.USERNAME || "standard_user";
  const password = process.env.PASSWORD || "secret_sauce";
  const baseUrl = getBaseUrl();

  // Navigate to login page
  await page.goto(baseUrl);

  // Create login page instance
  const loginPage = new LoginPage(page);

  // Perform login using environment variables
  await loginPage.login(username, password);

  // Wait for navigation to products page
  await page.waitForURL("**/inventory.html");

  // Verify login was successful
  const productsPage = new ProductsPage(page);
  await expect(productsPage.pageTitle).toBeVisible();
  await expect(productsPage.pageTitle).toHaveText("Products");

  // Save authentication state
  await page.context().storageState({ path: authFile });

  console.log("✓ Authentication successful and state saved");
  if (process.env.CI) {
    console.log(
      `✓ Using credentials from environment variables (USERNAME: ${username.substring(
        0,
        3
      )}***)`
    );
  }
});
