import { useContext } from 'react';
import { AuthenticatedContext } from '../shared/authenticated';

export const useAuth = () => {
  const auth = useContext(AuthenticatedContext);
  if (!auth) throw new Error('useAuth must be used inside AuthenticatedProvider');

  const isAuthenticated = !!auth.user;

  const login = (user: Parameters<typeof auth.setUser>[0]) => {
    auth.setUser(user as any);
  };

  const logout = () => auth.logout();

  return { user: auth.user, setUser: auth.setUser, isAuthenticated, login, logout };
};

export default useAuth;
