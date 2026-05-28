import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Retorna o estado de autenticação mock e as funções login/logout.
 *
 * @throws Se usado fora do AuthContextProvider.
 */
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error('useAuthContext must be used within AuthContextProvider');
  return ctx;
}

export { AuthContextProvider } from './AuthContextProvider';