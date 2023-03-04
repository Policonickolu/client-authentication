import { AppBar, Button, Toolbar, Typography, styled } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router';
import useAuth from 'src/hooks/useAuth';

const NAVBAR_HEIGHT = 64;
const PADDING_TOP = NAVBAR_HEIGHT * 1.2;

const Main = styled('main')({
  minHeight: `calc(100vh - ${PADDING_TOP}px)`,
  paddingTop: PADDING_TOP,
});

const ConnectedUserLayout = () => {
  const { logout, user } = useAuth();

  return (
    <Main>
      <AppBar position="fixed">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography>
            {user.firstname} {user.lastname}
            <Typography component="p" variant="caption">
              {user.email}
            </Typography>
          </Typography>
          <Button onClick={logout} variant="contained">
            Se déconnecter
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Main>
  );
};

export default ConnectedUserLayout;
