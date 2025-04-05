# Technical Documentation

## Configuration Management

### Environment Configuration
- Environment-specific settings are stored in `config/environment.json`
- Each environment (local, dev, uat, stg, prd) has its own configuration
- Environment selection is controlled by `TEST_ENV` environment variable
- Default environment is 'local' if `TEST_ENV` is not set

### Running Tests in Different Environments
```bash
# Local environment (default)
npm run test:local

# Development environment
npm run test:dev

# UAT environment
npm run test:uat

# Staging environment
npm run test:stg

# Production environment
npm run test:prd
```

## Parallel Login System

### Overview
The system is designed to handle multiple user logins in parallel before test execution. This ensures all required user tokens are available when needed.

### Key Components

1. **TokenStore**
   - Singleton class for managing user tokens
   - Stores tokens in memory with automatic expiry checking
   - Provides methods for token retrieval and management

2. **LoginService**
   - Handles parallel login processing
   - Configurable batch size for concurrent logins
   - Built-in retry mechanism for failed logins

3. **ConfigurationHelper**
   - Manages environment-specific configurations
   - Provides access to user credentials and service URLs
   - Must be initialized before use

### Configuration Settings
Located in `config/shared-config.json`:
```json
{
  "parallelLogin": {
    "maxConcurrent": 10,    // Maximum number of simultaneous logins
    "retryAttempts": 3,     // Number of retry attempts for failed logins
    "retryDelayMs": 1000    // Delay between retry attempts in milliseconds
  },
  "tokenStore": {
    "type": "memory",       // Storage type for tokens
    "expiryCheckIntervalMs": 60000  // Token expiry check interval
  }
}
```

## Important Considerations for Developers

### 1. Token Management
- Tokens are stored in memory and cleared when tests complete
- Expired tokens are automatically removed
- Use `TokenStore.getInstance()` to access tokens
- Tokens are accessible throughout test execution

### 2. User Configuration
- User credentials are environment-specific
- Users marked with `no_token: true` are skipped during login
- Passwords are standardized across environments
- Username is used as the key in the configuration

### 3. Error Handling
- Login failures are automatically retried
- Failed logins after retries will cause test setup to fail
- Detailed error logging is provided for debugging

### 4. Performance Considerations
- Parallel login reduces total setup time
- Batch size (maxConcurrent) can be adjusted based on system capacity
- Retry settings can be tuned based on network reliability

### 5. Security
- Never commit sensitive credentials to version control
- Use environment variables for production credentials
- Consider implementing token encryption for sensitive environments

### 6. Best Practices
- Always initialize ConfigurationHelper before use
- Use the provided getter methods instead of direct configuration access
- Handle token expiration in your test scenarios
- Clean up tokens after test completion

## Example Usage

### Accessing User Tokens
```typescript
const tokenStore = TokenStore.getInstance();
const tokenInfo = tokenStore.getToken('username');
```

### Getting User Credentials
```typescript
const credentials = ConfigurationHelper.getActorCredentials('username');
```

### Accessing Service URLs
```typescript
const baseUrl = ConfigurationHelper.getBaseUrl();
const loginUrl = ConfigurationHelper.getLoginServiceUrl();
```

## Troubleshooting

### Common Issues
1. **Configuration Not Initialized**
   - Error: "Cannot read property 'environments' of undefined"
   - Solution: Ensure ConfigurationHelper.initialize() is called before use

2. **Login Failures**
   - Check network connectivity
   - Verify service URLs in environment configuration
   - Confirm user credentials are correct

3. **Token Expiration**
   - Implement token refresh logic if needed
   - Adjust expiryCheckIntervalMs if tokens expire too quickly

### Debugging
- Enable detailed logging in LoginService
- Check console output for login process status
- Monitor token store for expired tokens
