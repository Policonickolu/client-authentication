import React from 'react';
import { Navigate } from 'react-router-dom';
import USER_ROLES from 'src/constants/userRoles';

import useAuth from '../../hooks/useAuth';

const UserRoot = () => {
  const { user } = useAuth();

  if (user.role === USER_ROLES.ADMIN) {
    return <Navigate to="/admin" />;
  }
  return <Navigate to="/user" />;
};

export default UserRoot;
