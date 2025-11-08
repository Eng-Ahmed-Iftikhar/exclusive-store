import { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '@/store';

// Returns stable references to auth and user slices to avoid selector warnings
export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth, shallowEqual);
  const user = useSelector((state: RootState) => state.user, shallowEqual);

  // Memoize the returned object so consumers don't get a new reference each render
  return useMemo(() => ({ auth, user }), [auth, user]);
};
