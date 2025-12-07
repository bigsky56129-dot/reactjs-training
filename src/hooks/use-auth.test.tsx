import { renderHook, act } from '@testing-library/react';
import { useAuth } from './use-auth';
import { AuthenticatedProvider } from '../shared/authenticated';

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactElement }) => (
    <AuthenticatedProvider>{children}</AuthenticatedProvider>
  );

  it('should return null user initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
  });

  it('should provide login function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(typeof result.current.login).toBe('function');
  });

  it('should provide logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(typeof result.current.logout).toBe('function');
  });

  it('should login user and store in localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      role: 'user' as const
    };

    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('authUser')).toBeTruthy();
  });

  it('should logout user and clear localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      role: 'user' as const
    };

    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('authUser')).toBeNull();
  });

  it('should restore user from localStorage on mount', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      role: 'user' as const
    };

    localStorage.setItem('authUser', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toEqual(mockUser);
  });
});
