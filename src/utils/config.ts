import * as fs from 'fs';
import * as path from 'path';

export interface UserCredentials {
  username: string;
  password: string;
}

export interface TestConfig {
  environment: string;
  baseUrl: string;
  credentials: {
    [key: string]: UserCredentials;
  };
  timeout?: {
    default?: number;
    navigation?: number;
  };
  headless?: boolean;
}

/**
 * Load configuration from profile JSON file
 * @param profileName - Name of the profile (e.g., 'default', 'staging', 'local')
 * @returns TestConfig object
 */
export function loadConfig(profileName: string = 'default'): TestConfig {
  const profilePath = path.join(process.cwd(), 'profiles', `${profileName}.json`);

  if (!fs.existsSync(profilePath)) {
    throw new Error(`Profile not found: ${profilePath}`);
  }

  const configData = fs.readFileSync(profilePath, 'utf-8');
  const config: TestConfig = JSON.parse(configData);

  // Override with environment variables if present
  if (process.env.BASE_URL) {
    config.baseUrl = process.env.BASE_URL;
  }

  if (process.env.USERNAME && process.env.PASSWORD) {
    config.credentials.custom = {
      username: process.env.USERNAME,
      password: process.env.PASSWORD
    };
  }

  return config;
}

/**
 * Get base URL from environment variable or config with default fallback
 */
export function getBaseUrl(): string {
  // Priority: Environment variable > Profile config > Default
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  try {
    const profile = process.env.PROFILE || "default";
    const config = loadConfig(profile);
    return config.baseUrl;
  } catch (error) {
    // If profile doesn't exist, use default
    return "https://www.saucedemo.com";
  }
}

/**
 * Get credentials for a specific user type
 * Note: This function is deprecated. Use USERNAME and PASSWORD environment variables instead.
 * @deprecated Use USERNAME and PASSWORD environment variables directly
 */
export function getCredentials(userType: string = 'standard_user'): UserCredentials {
  // Priority: Environment variables > Profile config
  if (process.env.USERNAME && process.env.PASSWORD) {
    return {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    };
  }

  try {
    const profile = process.env.PROFILE || "default";
    const config = loadConfig(profile);

    if (!config.credentials[userType]) {
      throw new Error(`Credentials not found for user type: ${userType}`);
    }

    return config.credentials[userType];
  } catch (error) {
    // Fallback to environment variables or defaults
    return {
      username: process.env.USERNAME || "standard_user",
      password: process.env.PASSWORD || "secret_sauce",
    };
  }
}

/**
 * Get environment name
 */
export function getEnvironment(): string {
  const profile = process.env.PROFILE || 'default';
  const config = loadConfig(profile);
  return config.environment;
}
