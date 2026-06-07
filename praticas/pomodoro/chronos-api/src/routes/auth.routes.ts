import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/jwt';

export const authRouter = Router();

// POST /auth/register — cadastro de novo usuário
authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: 'E-mail já cadastrado' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// POST /auth/login — autenticação
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos' });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos' });
  }

  const token = signToken({ userId: user.id, email: user.email });

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// POST /auth/forgot-password — gera token de recuperação
authRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: 'Informe o e-mail' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Retorna sucesso mesmo se o e-mail não existir (segurança)
  if (!user) {
    return res.json({ message: 'Se o e-mail existir, o token será exibido no console' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

  await prisma.user.update({
    where: { email },
    data: { resetToken, resetTokenExpiry },
  });

  // Em ambiente de laboratório: exibe o token no console
  console.log(`\n🔑 TOKEN DE RECUPERAÇÃO PARA ${email}:\n${resetToken}\n`);

  return res.json({
    message: 'Token gerado. Verifique o console da API.',
    // Em dev: retorna o token na resposta também para facilitar os testes
    resetToken,
  });
});

// POST /auth/reset-password — redefine a senha com o token
authRouter.post('/reset-password', async (req, res) => {
  const { token, password } = req.body as {
    token: string;
    password: string;
  };

  if (!token || !password) {
    return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ message: 'Token inválido ou expirado' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return res.json({ message: 'Senha redefinida com sucesso' });
});