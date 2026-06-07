import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middlewares/auth.middleware';

export const settingsRouter = Router();

// Todas as rotas de settings exigem autenticação
settingsRouter.use(authMiddleware);

// GET /settings
settingsRouter.get('/', async (req, res) => {
  let settings = await prisma.settings.findUnique({
    where: { userId: req.userId },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        userId: req.userId!,
        workTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
      },
    });
  }

  return res.json(settings);
});

// PUT /settings
settingsRouter.put('/', async (req, res) => {
  const { workTime, shortBreakTime, longBreakTime } = req.body as {
    workTime: number;
    shortBreakTime: number;
    longBreakTime: number;
  };

  if (
    !Number.isInteger(workTime) ||
    !Number.isInteger(shortBreakTime) ||
    !Number.isInteger(longBreakTime) ||
    workTime < 1 || workTime > 99 ||
    shortBreakTime < 1 || shortBreakTime > 30 ||
    longBreakTime < 1 || longBreakTime > 60
  ) {
    return res.status(400).json({ message: 'Valores inválidos' });
  }

  const settings = await prisma.settings.upsert({
    where: { userId: req.userId },
    update: { workTime, shortBreakTime, longBreakTime },
    create: {
      userId: req.userId!,
      workTime,
      shortBreakTime,
      longBreakTime,
    },
  });

  return res.json(settings);
});