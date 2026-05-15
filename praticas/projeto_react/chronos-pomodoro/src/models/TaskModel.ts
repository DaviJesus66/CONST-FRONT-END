import type { TaskStateModel } from './TaskStateModel';

export type TaskModel = {
  id: string; // Identificador único da tarefa
  name: string; // Nome digitado no input
  duration: number; // Duração em minutos
  startDate: number; // Timestamp de quando começou (usamos number para facilitar o localStorage)
  completed: boolean; // Indica se a tarefa foi concluída
  state: TaskStateModel; // Estado atual da tarefa (ativo, pausado, etc.)
};