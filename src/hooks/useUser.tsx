import { useContext } from 'react';
import { UserContext, UserContextType } from './contexts/userContexts';

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    console.log('useUser harus ada di dalam context provider');
  }

  return context;
};
