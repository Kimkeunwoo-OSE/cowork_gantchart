import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, TextField, Typography, Alert, Stack, Link } from '@mui/material';
import { authApi } from '../api/authApi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/projects');
    } catch (err) {
      setError('로그인에 실패했습니다.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2} align="center">
          로그인
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="이메일"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="비밀번호"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            로그인
          </Button>
          <Link component="button" variant="body2" onClick={() => navigate('/signup')} sx={{ alignSelf: 'center' }}>
            아직 계정이 없으신가요? 회원가입
          </Link>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
