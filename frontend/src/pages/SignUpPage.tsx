import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, TextField, Typography, Alert, Stack, Link } from '@mui/material';
import { authApi } from '../api/authApi';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    try {
      await authApi.signup({ name, email, password });
      alert('회원가입이 완료되었습니다. 로그인 해주세요.');
      navigate('/login');
    } catch (e) {
      setError('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper sx={{ p: 4, width: 420 }}>
        <Typography variant="h5" mb={2} align="center">
          회원가입
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="이름"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            회원가입
          </Button>
        </Stack>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          이미 계정이 있으신가요?{' '}
          <Link component="button" onClick={() => navigate('/login')}>로그인</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUpPage;
