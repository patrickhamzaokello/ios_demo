# API Usage Guide

This guide explains how to use the new API service with automatic token management in the Mwonya app.

## Overview

The new API system provides:
- Automatic JWT token attachment to requests
- Automatic token refresh when tokens expire
- Seamless retry of failed requests after token refresh
- Centralized error handling
- Type-safe API calls

## Key Files

- `utils/apiService.ts` - Core API service with interceptors
- `hooks/useApi.ts` - React hooks for API calls
- `services/userService.ts` - Example service implementation
- `contexts/authContext.tsx` - Authentication context (updated)

## User Data Storage

After successful login, the following data is stored in SecureStore:

```typescript
{
  accessToken: string,      // JWT access token
  refreshToken: string,     // JWT refresh token
  email: string,           // User's email
  username: string,        // User's username
  user_id: string,         // Unique user identifier
  userData: UserType,      // Complete user object
  hasCompletedOnboarding: string // "true" if onboarding completed
}
```

## API Service Usage

### Basic Usage

```typescript
import apiService from '@/utils/apiService';

// GET request
const response = await apiService.get('/api/endpoint');

// POST request
const response = await apiService.post('/api/endpoint', { data: 'value' });

// PUT request
const response = await apiService.put('/api/endpoint', { data: 'value' });

// PATCH request
const response = await apiService.patch('/api/endpoint', { data: 'value' });

// DELETE request
const response = await apiService.delete('/api/endpoint');
```

### Response Format

All API calls return a consistent response format:

```typescript
{
  success: boolean,
  data: T,              // Your actual data
  message?: string,     // Error message if success is false
  statusCode?: number   // HTTP status code for errors
}
```

### Error Handling

```typescript
try {
  const response = await apiService.get('/api/endpoint');
  
  if (response.success) {
    // Handle success
    console.log(response.data);
  } else {
    // Handle API error
    console.error(response.message);
  }
} catch (error) {
  // Handle network or other errors
  console.error('Request failed:', error);
}
```

## Using React Hooks

### useApi Hook

For complex API operations:

```typescript
import { useApi } from '@/hooks/useApi';

function MyComponent() {
  const { data, loading, error, execute } = useApi(
    (userId: string) => apiService.get(`/users/${userId}`)
  );

  const fetchUser = async () => {
    await execute('user123');
  };

  if (loading) return <Loading />;
  if (error) return <Text>Error: {error}</Text>;

  return <UserProfile user={data} />;
}
```

### Convenience Hooks

```typescript
import { usePost, useGet } from '@/hooks/useApi';

function LoginForm() {
  const { data, loading, error, execute } = usePost();

  const handleLogin = async () => {
    const result = await execute('/auth/login/', {
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (result) {
      // Login successful
    }
  };

  return (
    <Button onPress={handleLogin} loading={loading}>
      Login
    </Button>
  );
}
```

## Service Layer Pattern

Create service classes for organized API calls:

```typescript
// services/musicService.ts
import apiService from '@/utils/apiService';

export class MusicService {
  static async getPlaylists(page = 1) {
    const response = await apiService.get(`/playlists/?page=${page}`);
    return response.success ? response.data : null;
  }

  static async createPlaylist(name: string, description?: string) {
    const response = await apiService.post('/playlists/', {
      name,
      description
    });
    return response.success ? response.data : null;
  }
}

// Usage in component
import { MusicService } from '@/services/musicService';

const playlists = await MusicService.getPlaylists();
```

## Authentication Flow

### Login Process

1. User enters credentials
2. App calls `/auth/login/` endpoint
3. API returns user data and tokens:
   ```json
   {
     "email": "user@example.com",
     "username": "johndoe",
     "user_id": "uuid-here",
     "tokens": {
       "access": "jwt-access-token",
       "refresh": "jwt-refresh-token"
     }
   }
   ```
4. AuthContext stores all data in SecureStore
5. User is redirected to onboarding (if new) or home

### Token Refresh Process

1. API request fails with 401 status
2. ApiService automatically calls `/auth/refresh/` with refresh token
3. New access token is stored in SecureStore
4. Original request is retried with new token
5. If refresh fails, user is logged out automatically

### Logout Process

1. All tokens and user data are cleared from SecureStore
2. API service auth headers are cleared
3. User is redirected to welcome screen

## Error Handling

The API service handles various error scenarios:

### Network Errors
```typescript
// Network connectivity issues
{
  success: false,
  message: "Network request failed",
  statusCode: undefined
}
```

### API Errors
```typescript
// Server returned error response
{
  success: false,
  message: "Email already exists",
  statusCode: 400,
  data: { /* server error response */ }
}
```

### Authentication Errors
- 401 responses trigger automatic token refresh
- If refresh fails, user is automatically logged out
- All queued requests are retried after successful refresh

## Best Practices

### 1. Use Type Safety
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const response = await apiService.get<User>('/user/profile');
if (response.success) {
  // response.data is typed as User
  console.log(response.data.name);
}
```

### 2. Handle Loading States
```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await apiService.get('/data');
    // Handle response
  } finally {
    setLoading(false);
  }
};
```

### 3. Create Reusable Services
```typescript
// Good: Organized in service class
class UserService {
  static async getProfile() {
    return await apiService.get('/user/profile');
  }
}

// Avoid: Direct API calls in components
const response = await apiService.get('/user/profile');
```

### 4. Use Proper Error Boundaries
```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error}: {error: Error}) {
  return <Text>Something went wrong: {error.message}</Text>;
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <MyComponent />
</ErrorBoundary>
```

## Testing

The API service can be easily mocked for testing:

```typescript
// __mocks__/apiService.ts
export default {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};

// In your test
import apiService from '@/utils/apiService';

jest.mock('@/utils/apiService');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

test('should fetch user data', async () => {
  mockApiService.get.mockResolvedValue({
    success: true,
    data: { id: '1', name: 'John' }
  });

  // Your test logic here
});
```

## Migration from Old System

To migrate existing API calls:

### Before (old system)
```typescript
import axiosInstance from '@/utils/apiUtils';

const response = await axiosInstance.post('/endpoint', data);
const result = response.data;
```

### After (new system)
```typescript
import apiService from '@/utils/apiService';

const response = await apiService.post('/endpoint', data);
if (response.success) {
  const result = response.data;
}
```

This new system provides automatic token management, better error handling, and a more consistent API across your application.