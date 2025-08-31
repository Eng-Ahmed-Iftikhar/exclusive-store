import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useAuth = () =>
  useSelector((state: RootState) => {
    return {
      auth: state.auth,
      user: state.user,
    };
  });
