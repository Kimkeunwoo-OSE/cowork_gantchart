import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
  Stack,
  Link,
  Divider,
} from '@mui/material';
import { authApi } from '../api/authApi';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const navigate = useNavigate();

  const isNameValid = name.trim().length > 0;
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isNameValid && isEmailValid && isPasswordValid;

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await authApi.signup({ name: name.trim(), email: email.trim(), password });
      alert('회원가입이 완료되었습니다. 로그인 해주세요.');
      navigate('/login');
    } catch (e) {
      setError('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper sx={{ p: 4, width: 460 }}>
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
          onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
          error={touched.name && !isNameValid}
          helperText={touched.name && !isNameValid ? '이름을 입력해주세요.' : ''}
        />
        <TextField
          label="이메일"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
          error={touched.email && !isEmailValid}
          helperText={touched.email && !isEmailValid ? '유효한 이메일 주소를 입력해주세요.' : ''}
        />
        <TextField
          label="비밀번호"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
          error={touched.password && !isPasswordValid}
          helperText={touched.password && !isPasswordValid ? '비밀번호는 6자리 이상이어야 합니다.' : ''}
        />
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
          >
            회원가입
          </Button>
        </Stack>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          이미 계정이 있으신가요?{' '}
          <Link component="button" onClick={() => navigate('/login')}>
            로그인
          </Link>
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          비밀번호는 6자리 이상이어야 합니다.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          유효한 이메일 주소를 입력해주세요.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          관리자 계정은 admin@admin.com / admin 로 초기 설정됩니다.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUpPage;
