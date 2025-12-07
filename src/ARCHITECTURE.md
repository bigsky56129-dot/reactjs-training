# Project Architecture

## Overview

This project follows a modular architecture with clear separation of concerns:

- **utils/** - Helper functions available app-wide
  - `string.ts` - String manipulation utilities
  - `date.ts` - Date formatting and parsing
  - `validation.ts` - Form validation helpers
  - `rbac.ts` - Role-based access control utilities

- **hooks/** - Reusable React hooks
  - `use-fetch.ts` - Generic fetch hook with loading/error and retry support
  - `use-auth.ts` - Small helper wrapper around AuthenticatedContext

- **store/** - Central place for state management
  - `user-store.ts` - Wrapper against AuthenticatedContext (keeps one source of truth)
  - `index.ts` - Re-exports all stores

- **features/** - Feature-specific components
  - `user-profile/` - User profile related components
    - `components/UserCard.tsx`
    - `components/UserDetail.tsx`
    - `index.ts`

- **services/** - API layer
  - `api.ts` - Centralized API service with error handling and retry logic

- **components/** - Reusable UI components
  - `protected-route.tsx` - RBAC route wrapper
  - `header/` - Application header with user menu
  - `footer/` - Application footer
  - `sidebar/` - Navigation sidebar

- **pages/** - Page components organized by feature
  - `auth/` - Authentication pages (login, logout, reset password, sign up)
  - `clients/` - User management pages
    - `users-list.tsx` - User list with search and multiple views (list/grid/table)
    - `components/` - View-specific components (ListView, GridView, TableView)
  - `home/` - Dashboard/home page
  - `review/` - KYC review page (officer only)
  - `user/` - User profile pages
    - `personal-information/` - Profile viewing and editing
    - `kyc/` - KYC status page

## Why These Changes?

- **Centralized helpers** reduce duplication and increase consistency
- **Reusable hooks** standardize API access & fetch handling with retry/backoff
- **Small store wrapper** provides a single import point for authentication state
- **Feature folders** make it easy to scale and keep related UI code together
- **Component separation** improves reusability and testability

## How to Use

### Hooks

```typescript
// Fetch data with automatic retry and error handling
const { data, loading, error, refetch } = useFetch(url, options);

// Access authentication state
const { user, setUser, isAuthenticated, login, logout } = useAuth();

// Alternative: Use store wrapper
const { user, setUser, logout } = useUserStore();
```

### RBAC

```typescript
// Check if user has permission
hasPermission(user.role, 'view:all-profiles');

// Check if user can access a profile
canAccessProfile(currentUserId, userRole, targetUserId);

// Protect routes
<ProtectedRoute requiredPermission="view:all-profiles">
  <UsersList />
</ProtectedRoute>
```

### API Services

```typescript
// Fetch users with pagination
const users = await fetchUsers(limit, skip);

// Search users
const results = await searchUsers('john');

// Update profile
await updateUserProfile(userId, { firstName: 'John' });

// Upload profile picture (blob URL stored in localStorage)
const { url } = await uploadProfilePicture(userId, file, username);

// Get profile picture URL (checks localStorage first, falls back to API image)
const imageUrl = getProfilePictureUrl(username, userId, fallbackUrl);
```

## State Management

### Global State
- **AuthenticatedContext** - User authentication and session
- Stored in localStorage with key `authUser`
- Auto-syncs on updates

### Local State
- Component-level state for UI interactions
- Form state management
- Upload/delete operations

### Profile Pictures
- Stored in localStorage with key format: `profile_picture_{username}`
- Uses blob URLs for client-side preview
- Custom event `profilePictureUpdated` for real-time updates across components

## Key Features

### 1. Multiple View Modes
Users list supports three view modes:
- **List View** - Compact list with avatars
- **Grid View** - Card-based layout with badges
- **Table View** - Excel-like table with all fields

### 2. Profile Picture System
- Upload validation (JPG/PNG/GIF, max 800KB)
- Stored as blob URLs in localStorage
- Consistent display across all components (header, profile, user lists)
- Real-time updates using custom events

### 3. Search Functionality
- Search users by name, email, or username
- Debounced search for better performance
- Results displayed in selected view mode

### 4. Role-Based Access Control
- Permission-based route protection
- Dynamic sidebar based on user role
- Field-level access control (e.g., email and role readonly in profile)

## Next Steps

### Potential Enhancements
- Add unit tests for hooks and components
- Implement server-side profile picture storage
- Add image cropping/editing before upload
- Implement pagination in search results
- Add more sorting/filtering options in user lists
- Replace placeholder anchors (`href="#"`) with accessible buttons
- Add keyboard focus trap for dropdowns
- Implement profile picture deletion functionality
