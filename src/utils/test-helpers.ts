import { Page } from '@playwright/test';

/**
 * Wait for a specific amount of time
 * @param ms - Milliseconds to wait
 */
export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random string
 * @param length - Length of the string
 */
export function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate random email
 */
export function generateRandomEmail(): string {
  return `test.${generateRandomString(8)}@example.com`;
}

/**
 * Generate random postal code
 */
export function generateRandomPostalCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `playwright/output/screenshots/${name}-${timestamp}.png`,
    fullPage: true
  });
}

/**
 * Parse price string to number
 * @param priceString - Price string like "$29.99"
 */
export function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace('$', ''));
}

/**
 * Calculate total from array of prices
 */
export function calculateTotal(prices: string[]): number {
  return prices.reduce((sum, price) => sum + parsePrice(price), 0);
}

/**
 * Format number as currency
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Get current timestamp
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}
