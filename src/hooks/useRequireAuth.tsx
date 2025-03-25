
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const useRequireAuth = (redirectTo = '/sign-in') => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate(redirectTo);
    }
  }, [user, isLoading, navigate, redirectTo]);

  return { user, isLoading };
};
