# Pure Data Auth Plugin Example

The auth plugin now works with **pure data** internally, making it perfect for external REST API integration.

## Default Behavior (StartupJS)

```javascript
// No overrides = uses StartupJS scopes internally, extracts pure data
{
  name: 'auth',
  options: {
    getUsersFilterQueryParams: () => ({ deleted: { $ne: true } }),
    providers: { google: {}, local: {} }
  }
}
```

## External Service Integration

```javascript
// Override pure data functions to call your external security service
{
  name: 'auth',
  options: {
    getUsersFilterQueryParams: () => ({ deleted: { $ne: true } }),
    
    // Override to get auth data from external service
    getAuthData: async (provider, providerId, filterParams) => {
      const response = await fetch(`https://your-security-service.com/auth/${provider}/${providerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterParams)
      })
      
      if (!response.ok) return null
      
      const authData = await response.json()
      return {
        userId: authData.id,
        email: authData.email,
        providerIds: authData.providers,
        providerToken: authData.tokens[provider] // for password validation
      }
    },
    
    getAuthDataByUserId: async (userId) => {
      const response = await fetch(`https://your-security-service.com/users/${userId}/auth`)
      if (!response.ok) return null
      
      const authData = await response.json()
      return {
        userId: authData.id,
        email: authData.email,
        providerIds: authData.providers
      }
    },
    
    // Only override if you need 2FA from external service
    getAuthDataBySecret: async (provider, secret) => {
      const response = await fetch(`https://your-security-service.com/2fa/validate`, {
        method: 'POST',
        body: JSON.stringify({ provider, secret })
      })
      if (!response.ok) return null
      
      const authData = await response.json()
      return {
        userId: authData.id,
        email: authData.email,
        providerIds: authData.providers,
        secret: authData.base32Secret // for TOTP validation
      }
    },
    
    providers: { google: {}, local: {} }
  }
}
```

## What Each Function Returns

### `getAuthData(provider, providerId, filterParams)`
Used for: Login validation, registration checks
Returns:
```javascript
{
  userId: "user123",
  email: "user@example.com", 
  providerIds: ["google", "local"],
  providerToken: "hashed_password_or_token" // for validation
}
```

### `getAuthDataByUserId(userId)`
Used for: Force login, session creation
Returns:
```javascript
{
  userId: "user123",
  email: "user@example.com",
  providerIds: ["google", "local"]
}
```

### `getAuthDataBySecret(provider, secret)`
Used for: 2FA login
Returns:
```javascript
{
  userId: "user123", 
  email: "user@example.com",
  providerIds: ["google", "local", "2fa"],
  secret: "base32_secret_for_totp"
}
```

### `getAuthDataByEmail(email, excludeProvider, filterParams)`
Used for: Auto-merge by email during OAuth
Returns:
```javascript
{
  userId: "user123",
  email: "user@example.com", 
  providerIds: ["google"] // excludes the specified provider
}
```
