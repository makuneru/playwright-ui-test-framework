import { defineConfig, devices } from '@playwright/test';
import { loadConfig } from './src/utils/config';
import path from 'path';

/**
 * Load configuration with environment variable priority
 * Priority: Environment variables > Profile config > Defaults
 * 
 * Environment Variables:
 * - BASE_URL: Overrides baseUrl (default: https://www.saucedemo.com)
 * - USERNAME: GitHub Secret for username (required in CI)
 * - PASSWORD: GitHub Secret for password (required in CI)
 * - PROFILE: Profile name (optional, defaults to 'default')
 */
let config: ReturnType<typeof loadConfig>;
let profile = process.env.PROFILE || "default";

try {
  config = loadConfig(profile);
} catch (error) {
  // If profile doesn't exist, create a minimal config
  config = {
    environment: process.env.CI ? "ci" : "local",
    baseUrl: process.env.BASE_URL || "https://www.saucedemo.com",
    credentials: {},
    timeout: {
      default: 30000,
      navigation: 30000,
    },
    headless: true,
  };
}

// Override baseUrl with environment variable if provided
if (process.env.BASE_URL) {
  config.baseUrl = process.env.BASE_URL;
} else if (!config.baseUrl) {
  config.baseUrl = "https://www.saucedemo.com";
}

// Log configuration being used in CI for debugging
if (process.env.CI) {
  console.log(`Using profile: ${profile}`);
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(
    `Username from env: ${
      process.env.USERNAME ? "✓ Set" : "✗ Not set (will use default)"
    }`
  );
  console.log(
    `Password from env: ${
      process.env.PASSWORD ? "✓ Set" : "✗ Not set (will use default)"
    }`
  );
}

// Helper function to get browser configuration
const getBrowserConfig = () => {
  const commonViewport = { width: 1600, height: 900 };
  const isCI = !!process.env.CI;

  switch (process.env.BROWSER?.toLowerCase()) {
    case "firefox":
      return {
        ...devices["Desktop Firefox"],
        viewport: commonViewport,
      };
    case "safari":
      return {
        ...devices["Desktop Safari"],
        viewport: commonViewport,
      };
    case "edge":
      return {
        ...devices["Desktop Edge"],
        channel: "msedge",
        viewport: commonViewport,
      };
    case "chrome":
      // In CI, use Chromium instead of Chrome channel
      if (isCI) {
        return {
          ...devices["Desktop Chrome"],
          viewport: commonViewport,
        };
      }
      return {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: commonViewport,
      };
    default:
      // In CI, use Chromium (bundled with Playwright) instead of Chrome channel
      if (isCI) {
        return {
          ...devices["Desktop Chrome"],
          viewport: commonViewport,
        };
      }
      return {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: commonViewport,
      };
  }
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Workers */
  workers: process.env.CI ? 4 : 1,

  /* Global timeout */
  globalTimeout: 60 * 60 * 1000, // 60 minutes

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
        ['list'],
        ['html', { outputFolder: 'playwright/report', open: 'never' }],
        ['junit', { outputFile: 'playwright/report/results.xml' }],
        ['json', { outputFile: 'playwright/output/results.json' }],
      ]
    : [
        ['list'],
        ['html', { outputFolder: 'playwright/report', open: 'never' }],
        ['json', { outputFile: 'playwright/output/results.json' }],
      ],

  /* Output directory for test artifacts */
  outputDir: 'playwright/output',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL from profile configuration */
    baseURL: config.baseUrl,

    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,

    /* Bypass CSP */
    bypassCSP: true,

    /* Timezone */
    timezoneId: process.env.TIMEZONE || 'UTC',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: {
      mode: 'retain-on-failure',
      snapshots: true,
      screenshots: true,
      sources: true,
    },

    /* Screenshot on failure */
    screenshot: { mode: 'on', fullPage: true },

    /* Video on failure */
    video: process.env.CI ? 'retain-on-failure' : 'on',

    /* Timeouts from profile */
    actionTimeout: config.timeout?.default || 30000,
    navigationTimeout: config.timeout?.navigation || 30000,

    /* Headless mode from profile or environment variable */
    headless: process.env.HEADLESS !== 'false' && (config.headless !== undefined ? config.headless : true),
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project - runs before all tests
    {
      name: 'setup',
      use: getBrowserConfig(),
      testDir: './src/setup',
      testMatch: 'auth.setup.ts',
      teardown: 'teardown',
    },

    // UI Tests - Chrome (default)
    {
      name: 'ui-tests',
      use: {
        ...getBrowserConfig(),
        storageState: path.join(__dirname, '.auth/user.json'),
      },
      testDir: './tests',
      testMatch: ['**/*.spec.ts', '**/*.test.ts'],
      dependencies: ['setup'],
    },

    // Teardown project - runs after all tests
    {
      name: 'teardown',
      testDir: './src/setup',
      testMatch: 'auth.teardown.ts',
    },
  ],

  /* Test match patterns */
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],

  /* Global timeout for each test */
  timeout: 3 * 60 * 1000, // 3 minutes

  /* Expect timeout */
  expect: {
    timeout: 1 * 60 * 1000, // 1 minute
  },
});
