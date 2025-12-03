import { ReactNode } from 'react';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

const AppLayout = ({ children }: Props) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="static" color="primary" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/projects')}>
            협업툴 V1
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
};

export default AppLayout;
