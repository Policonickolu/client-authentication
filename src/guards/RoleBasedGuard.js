import React from 'react';
import { Navigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

const RoleBasedGuard = ({ accessibleRoles, children }) => {
  const { user } = useAuth();

  if (!accessibleRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

export default RoleBasedGuard;
