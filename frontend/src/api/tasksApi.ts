import api from './axiosInstance';
import { Task, TaskQueryFilters, TaskFormInput, GanttTaskItem, TaskUpdateInput } from '../types/task';

export const tasksApi = {
  getTasks: (projectId: number, filters: TaskQueryFilters) =>
    api.get<Task[]>(`/projects/${projectId}/tasks`, { params: filters }),
  getTask: (taskId: number) => api.get<Task>(`/tasks/${taskId}`),
  createTask: (projectId: number, payload: TaskFormInput) =>
    api.post<Task>(`/projects/${projectId}/tasks`, payload),
  updateTask: (taskId: number, payload: TaskUpdateInput) =>
    api.put<Task>(`/tasks/${taskId}`, payload),
  deleteTask: (taskId: number) => api.delete(`/tasks/${taskId}`),
  getGantt: (projectId: number, filters: TaskQueryFilters) =>
    api.get<GanttTaskItem[]>(`/projects/${projectId}/gantt`, { params: filters }),
};
