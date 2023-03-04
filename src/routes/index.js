import React, { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import LoadingScreen from 'src/components/LoadingScreen';
import USER_ROLES from 'src/constants/userRoles';
import AuthGuard from 'src/guards/AuthGuard';
import GuestGuard from 'src/guards/GuestGuard';
import RoleBasedGuard from 'src/guards/RoleBasedGuard';
import useAuth from 'src/hooks/useAuth';
import ConnectedUserLayout from 'src/layouts/ConnectedUserLayout';

// eslint-disable-next-line react/display-name
const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isInitialized } = useAuth();

  const renderLoadingScreen = <LoadingScreen />;

  return (
    <Suspense fallback={renderLoadingScreen}>
      {isInitialized ? <Component {...props} /> : renderLoadingScreen}
    </Suspense>
  );
};

const Router = () =>
  useRoutes([
    // Public pages
    {
      element: (
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      ),
      path: 'login',
    },
    // Private pages
    {
      children: [
        { element: <UserRootPage />, path: '' },
        {
          element: (
            <RoleBasedGuard accessibleRoles={[USER_ROLES.USER]}>
              <UserPage />
            </RoleBasedGuard>
          ),
          path: 'user',
        },
        {
          element: (
            <RoleBasedGuard accessibleRoles={[USER_ROLES.ADMIN]}>
              <AdminPage />
            </RoleBasedGuard>
          ),
          path: 'admin',
        },
      ],
      element: (
        <AuthGuard>
          <ConnectedUserLayout />
        </AuthGuard>
      ),
      path: '',
    },
    {
      element: <Navigate to="/" />,
      path: '*',
    },
  ]);

// Authentication Pages
const LoginPage = Loadable(lazy(() => import('../pages/auth/Login')));

// Users Pages
const UserRootPage = Loadable(lazy(() => import('../pages/private/UserRoot')));
const UserPage = Loadable(lazy(() => import('../pages/private/User')));
const AdminPage = Loadable(lazy(() => import('../pages/private/Admin')));

export default Router;
