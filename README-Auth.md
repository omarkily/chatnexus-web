# ChatNexus Authentication System

This document outlines the authentication system implemented in the ChatNexus application.

## Overview

The authentication system uses a token-based approach with cookies to maintain user sessions. When a user logs in, a token is obtained from the backend API and stored in a cookie. This token is then used to authenticate subsequent requests.

## Key Components

### 1. Login Page (`app/login/page.tsx`)

- Checks if a token exists; if so, redirects to the dashboard
- Provides a login form with "Remember Me" option
- Makes API request to authenticate user
- Stores the returned token in cookies

### 2. Authentication Utilities (`lib/auth.ts`)

- `login(payload)`: Makes a login request to the API
- `logout()`: Removes the token cookie
- `setToken(token, remember)`: Sets the token in cookies with appropriate expiration
- `getToken()`: Retrieves the token from cookies
- `isAuthenticated()`: Checks if a valid token exists
- API client with interceptors to automatically add the token to request headers

### 3. Middleware (`middleware.ts`)

- Protects routes that require authentication
- Redirects unauthenticated users to the login page
- Redirects authenticated users away from the login page when already logged in

### 4. Logout Button (`components/logout-button.tsx`)

- Component to handle user logout
- Removes the token and redirects to the login page

## Configuration

The backend API URL is configured via environment variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Update this URL in the `.env.local` file to point to your backend service.

## Remember Me Functionality

When the "Remember Me" option is selected:
1. A `expire` parameter is added to the login payload with value `1209600` (14 days in seconds)
2. The token cookie is set with a 14-day expiration instead of the default 1 day

## API Integration

The authentication system expects the backend API to:
1. Accept POST requests to `/api/auth/login` with email and password credentials
2. Return a response with a `token` field containing the JWT or other authentication token
3. Accept the token in the `Authorization` header format: `Bearer {token}`

## Security Considerations

- Tokens are stored in cookies for better security compared to localStorage
- Protected routes are secured via middleware
- The login page automatically redirects already authenticated users to the dashboard 