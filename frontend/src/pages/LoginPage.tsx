import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Typography, Stack } from '@mui/material';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2} align="center">
          로그인 없이 바로 이용
        </Typography>
        <Stack direction="column" spacing={1.5} sx={{ mt: 2 }}>
          <Button variant="contained" fullWidth onClick={() => navigate('/projects')}>
            프로젝트 바로가기
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            내부용 환경으로 별도 로그인 없이 바로 사용할 수 있습니다.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
