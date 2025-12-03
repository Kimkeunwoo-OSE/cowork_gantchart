import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Typography, Divider } from '@mui/material';

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper sx={{ p: 4, width: 460 }}>
        <Typography variant="h5" mb={2} align="center">
          회원가입 없이 바로 이용
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          이 내부용 데모 환경에서는 계정 생성 없이 바로 프로젝트와 업무를 사용할 수 있도록 인증이
          비활성화되어 있습니다.
        </Typography>
        <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={() => navigate('/projects')}>
          프로젝트 바로 가기
        </Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          기존 계정이 필요한 환경으로 이전될 때에는 관리자에게 문의해주세요.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUpPage;
