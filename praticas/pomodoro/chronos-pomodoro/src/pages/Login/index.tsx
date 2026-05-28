import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { DefaultInput } from '../../components/DefaultInput';
import { useAuthContext } from '../../contexts/AuthContext';
import { showMessage } from '../../adapters/showMessage';
import styles from './styles.module.css';

type ViewMode = 'login' | 'register' | 'recover';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  // Inputs controlados
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Controla qual "tela" está visível
  const [viewMode, setViewMode] = useState<ViewMode>('login');

  // Foca automaticamente no campo de usuário ao carregar
  const usernameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  // Atualiza o título da aba
  useEffect(() => {
    document.title = 'Login - Chronos Pomodoro';
  }, []);

  // Limpa as mensagens ao trocar de modo
  useEffect(() => {
    showMessage.dismiss();
  }, [viewMode]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();

    if (!username.trim()) {
      showMessage.warn('Informe o usuário');
      return;
    }

    if (!password) {
      showMessage.warn('Informe a senha');
      return;
    }

    const ok = login(username, password);
    if (ok) {
      showMessage.success('Bem-vindo!');
      navigate('/home');
    } else {
      showMessage.error('Usuário ou senha inválidos');
    }
  }

  function handleRegisterClick() {
    showMessage.dismiss();
    setViewMode('register');
    showMessage.info('Fluxo de cadastro ainda será implementado');
  }

  function handleRecoverClick() {
    showMessage.dismiss();
    setViewMode('recover');
    showMessage.info('Fluxo de recuperação de senha ainda será implementado');
  }

  function handleBackToLogin() {
    showMessage.dismiss();
    setViewMode('login');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo / título */}
        <div className={styles.header}>
          <span className={styles.logoIcon}>⏱</span>
          <h1 className={styles.title}>Chronos Pomodoro</h1>
          <p className={styles.subtitle}>
            {viewMode === 'login' && 'Acesse sua conta'}
            {viewMode === 'register' && 'Criar nova conta'}
            {viewMode === 'recover' && 'Recuperar senha'}
          </p>
        </div>

        {/* Tela de login */}
        {viewMode === 'login' && (
          <form onSubmit={handleSubmit} className={styles.form} action="">
            <div className={styles.field}>
              <DefaultInput
                id="login-user"
                labelText="Usuário"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                ref={usernameRef}
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <DefaultInput
                id="login-pass"
                labelText="Senha"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className={styles.btnPrimary}
              aria-label="Entrar no sistema"
            >
              Entrar
            </button>

            <div className={styles.links}>
              <button
                type="button"
                className={styles.btnLink}
                onClick={handleRegisterClick}
                aria-label="Ir para cadastro"
              >
                Não tem conta? Cadastre-se
              </button>

              <button
                type="button"
                className={styles.btnLink}
                onClick={handleRecoverClick}
                aria-label="Recuperar senha"
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        )}

        {/* Tela simulada de cadastro */}
        {viewMode === 'register' && (
          <div className={styles.simulationBox}>
            <p>📋 Tela de cadastro</p>
            <p className={styles.simulationText}>
              Esta funcionalidade será implementada em breve.
            </p>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handleBackToLogin}
            >
              Voltar ao login
            </button>
          </div>
        )}

        {/* Tela simulada de recuperação */}
        {viewMode === 'recover' && (
          <div className={styles.simulationBox}>
            <p>🔑 Tela de recuperação de senha</p>
            <p className={styles.simulationText}>
              Esta funcionalidade será implementada em breve.
            </p>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handleBackToLogin}
            >
              Voltar ao login
            </button>
          </div>
        )}

        {/* Dica das credenciais mock */}
        <p className={styles.hint}>
          Usuário: <strong>demo</strong> | Senha: <strong>demo123</strong>
        </p>
      </div>
    </div>
  );
}