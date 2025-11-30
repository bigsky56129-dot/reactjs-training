import { useContext } from 'react';
import { AuthenticatedContext, User } from '../shared/Authenticated';

// Small wrapper to the existing AuthenticatedContext so other components can import from store rather than from shared directly
export function useUserStore() {
  const auth = useContext(AuthenticatedContext);
  if (!auth) throw new Error('useUserStore must be used inside AuthenticatedProvider');

  // expose convenience helpers
  const setUser = (u: User | null) => auth.setUser(u);
  const logout = () => auth.logout();
  const user = auth.user;
  return { user, setUser, logout };
}

export default useUserStore;
