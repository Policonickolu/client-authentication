import { useLazyQuery } from '@apollo/client';
import React, { createContext, useEffect, useState } from 'react';
import { CURRENT_USER } from 'src/graphql/users/queries';
import { getTokenFromLocalStorage, setSession } from 'src/utils/jwt';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const logout = () => {
    setSession();
    setIsAuthenticated(false);
  };

  // eslint-disable-next-line no-unused-vars
  const [getCurrentUser, { data: currentUser, refetch: refetchCurrentUser }] = useLazyQuery(
    CURRENT_USER,
    {
      nextFetchPolicy: 'cache-and-network',
      onCompleted: (data) => {
        if (data) {
          setIsAuthenticated(true);
        }
        return data;
      },
      onError: (error) => {
        if (error.graphQLErrors) {
          error.graphQLErrors.forEach(({ extensions }) => {
            if (extensions.code === 'UNAUTHENTICATED') {
              logout();
            }
          });
        }
      },
      refetchWritePolicy: 'overwrite',
    }
  );

  const onLoginSuccess = (token) => {
    setSession(token);
    refetchCurrentUser();
  };

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (!token) {
      setIsInitialized(true);
    } else {
      refetchCurrentUser().finally(() => {
        setIsInitialized(true);
      });
    }
  }, [refetchCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        logout,
        onLoginSuccess,
        user: currentUser?.me,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
