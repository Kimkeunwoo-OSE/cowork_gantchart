import { ReactNode } from 'react';
import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  children: ReactNode;
}

const AppLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="static" color="primary" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/projects')}>
            협업툴 V1
          </Typography>
          {!isLoginPage && user && (
            <>
              <Typography sx={{ mr: 2 }}>{user.name}</Typography>
              <Button color="inherit" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
};

export default AppLayout;
