import React from 'react';
import { Navigate } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import useAuth from '../hooks/useAuth';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
