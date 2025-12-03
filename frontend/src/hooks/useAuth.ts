import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      if (!token) throw new Error('unauthorized');
      const { data } = await authApi.me();
      return data;
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (meQuery.error && location.pathname !== '/login') {
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  }, [meQuery.error, navigate, location.pathname]);

  return {
    user: meQuery.data,
    isAuthenticated: !!token && !meQuery.isError,
    isLoading: meQuery.isLoading,
    refetch: meQuery.refetch,
  };
};
