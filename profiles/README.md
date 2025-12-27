# Profile Configuration Files

## ⚠️ Important: These are Example Files Only

**DO NOT store real credentials in these profile files.** All sensitive credentials should be stored as GitHub Secrets.

## Environment Variable Priority

The framework uses the following priority order for configuration:

1. **Environment Variables** (GitHub Secrets) - Highest Priority
2. Profile JSON files (for non-sensitive config)
3. Default values - Lowest Priority

## GitHub Secrets Setup

For CI/CD runs, add the following secrets to your GitHub repository:

### Required Secrets (for CI)
- `USERNAME` - Username for authentication
- `PASSWORD` - Password for authentication

### Optional Variables
- `BASE_URL` - Base URL for the application (defaults to `https://www.saucedemo.com`)
- `PROFILE` - Profile name to use (defaults to `default`)

## Local Development

For local development, you can either:

1. **Use environment variables:**
   ```bash
   export USERNAME=your_username
   export PASSWORD=your_password
   npm test
   ```

2. **Use profile files** (update the example values):
   - Edit `profiles/default.json` or `profiles/local.json`
   - Replace `YOUR_USERNAME_HERE` and `YOUR_PASSWORD_HERE` with actual values
   - ⚠️ **Never commit real credentials to git!**

## Profile Files

- `default.json` - Default configuration for production
- `staging.json` - Staging environment configuration
- `local.json` - Local development configuration (headless: false)

## Configuration Structure

```json
{
  "environment": "prod",
  "baseUrl": "https://www.saucedemo.com",
  "credentials": {
    "standard_user": {
      "username": "YOUR_USERNAME_HERE",
      "password": "YOUR_PASSWORD_HERE"
    }
  },
  "timeout": {
    "default": 30000,
    "navigation": 30000
  },
  "headless": false
}
```

## Security Best Practices

✅ **DO:**
- Store credentials in GitHub Secrets
- Use environment variables in CI/CD
- Keep profile files as examples only
- Use `.gitignore` to prevent accidental commits

❌ **DON'T:**
- Commit real credentials to the repository
- Store passwords in plain text files
- Share credentials in code reviews
- Use production credentials in test profiles

