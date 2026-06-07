import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middlewares/auth.middleware';

export const tasksRouter = Router();

// Todas as rotas de tasks exigem autenticação
tasksRouter.use(authMiddleware);

// GET /tasks
tasksRouter.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId },
    orderBy: { startDate: 'desc' },
  });

  const serialized = tasks.map(task => ({
    ...task,
    startDate: Number(task.startDate),
    completeDate: task.completeDate ? Number(task.completeDate) : null,
    interruptDate: task.interruptDate ? Number(task.interruptDate) : null,
  }));

  return res.json(serialized);
});

// POST /tasks
tasksRouter.post('/', async (req, res) => {
  const { id, name, duration, type, startDate } = req.body as {
    id: string;
    name: string;
    duration: number;
    type: string;
    startDate: number;
  };

  if (!id || !name || !duration || !type || !startDate) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
  }

  const task = await prisma.task.create({
    data: {
      id,
      name,
      duration,
      type,
      startDate: BigInt(startDate),
      userId: req.userId!,
    },
  });

  return res.status(201).json({
    ...task,
    startDate: Number(task.startDate),
    completeDate: null,
    interruptDate: null,
  });
});

// PATCH /tasks/:id/complete
tasksRouter.patch('/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { completeDate } = req.body as { completeDate: number };

  if (!completeDate) {
    return res.status(400).json({ message: 'completeDate é obrigatório' });
  }

  try {
    const task = await prisma.task.update({
      where: { id, userId: req.userId },
      data: { completeDate: BigInt(completeDate) },
    });

    return res.json({
      ...task,
      startDate: Number(task.startDate),
      completeDate: Number(task.completeDate),
      interruptDate: task.interruptDate ? Number(task.interruptDate) : null,
    });
  } catch {
    return res.status(404).json({ message: 'Task não encontrada' });
  }
});

// PATCH /tasks/:id/interrupt
tasksRouter.patch('/:id/interrupt', async (req, res) => {
  const { id } = req.params;
  const { interruptDate } = req.body as { interruptDate: number };

  if (!interruptDate) {
    return res.status(400).json({ message: 'interruptDate é obrigatório' });
  }

  try {
    const task = await prisma.task.update({
      where: { id, userId: req.userId },
      data: { interruptDate: BigInt(interruptDate) },
    });

    return res.json({
      ...task,
      startDate: Number(task.startDate),
      completeDate: task.completeDate ? Number(task.completeDate) : null,
      interruptDate: Number(task.interruptDate),
    });
  } catch {
    return res.status(404).json({ message: 'Task não encontrada' });
  }
});

// DELETE /tasks
tasksRouter.delete('/', async (req, res) => {
  await prisma.task.deleteMany({ where: { userId: req.userId } });
  return res.status(204).send();
});