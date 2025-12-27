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
 * Get base URL from config
 */
export function getBaseUrl(): string {
  const profile = process.env.PROFILE || 'default';
  const config = loadConfig(profile);
  return config.baseUrl;
}

/**
 * Get credentials for a specific user type
 */
export function getCredentials(userType: string = 'standard_user'): UserCredentials {
  const profile = process.env.PROFILE || 'default';
  const config = loadConfig(profile);

  if (!config.credentials[userType]) {
    throw new Error(`Credentials not found for user type: ${userType}`);
  }

  return config.credentials[userType];
}

/**
 * Get environment name
 */
export function getEnvironment(): string {
  const profile = process.env.PROFILE || 'default';
  const config = loadConfig(profile);
  return config.environment;
}
