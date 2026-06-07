import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes';
import { settingsRouter } from './routes/settings.routes';
import { tasksRouter } from './routes/tasks.routes';

export const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/settings', settingsRouter);
app.use('/tasks', tasksRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});