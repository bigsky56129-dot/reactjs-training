Project structure & new utilities/hooks/store (what I added)

Overview
- utils/: helper functions available app-wide
  - string.ts, date.ts, validation.ts
- hooks/: reusable hooks
  - use-fetch.ts — generic fetch hook with loading/error and retry support
  - use-auth.ts — small helper wrapper around AuthenticatedContext
- store/: central place for state management hooks
  - user-store.ts — wrapper against AuthenticatedContext (keeps one source of truth)
  - index.ts — re-exports
- features/user-profile/ — example feature grouping
  - components/UserCard.tsx
  - components/UserDetail.tsx
  - index.ts

Why these changes?
- Centralized helpers reduce duplication and increase consistency.
- Reusable hooks standardize API access & fetch handling with retry/backoff.
- Small store wrapper provides a single import point for authentication state.
- Feature folders make it easy to scale and keep UI code together.

How to use
- useFetch(url, options) returns {data, loading, error, refetch}
- useAuth() returns {user, setUser, isAuthenticated, login, logout}
- useUserStore() returns {user, setUser, logout}

Next steps you can ask me to take
- Replace placeholder anchors (href="#") with <Link> or accessible buttons
- Add keyboard focus trap and advanced keyboard navigation for dropdowns
- Add unit tests for hooks and components
