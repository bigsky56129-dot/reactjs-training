import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthenticatedContext} from '../shared/authenticated';

const RedirectRoot: React.FC = () => {
  const auth = useContext(AuthenticatedContext);
  const user = auth?.user;

  if (!user) return <Navigate to="/login" replace />;

  // officer => clients list
  if (user.role === 'officer') return <Navigate to="/pages/clients" replace />;

  // otherwise navigate to profile page (use id)
  return <Navigate to={`/pages/user/${user.id}/pi`} replace />;
}

export default RedirectRoot;