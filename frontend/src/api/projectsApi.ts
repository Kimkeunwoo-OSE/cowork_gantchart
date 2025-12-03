import api from './axiosInstance';
import { Project, ProjectFilters, ProjectPayload } from '../types/project';

export const projectsApi = {
  getProjects: (filters: ProjectFilters) =>
    api.get<Project[]>('/projects', { params: filters }),
  getProject: (projectId: number) => api.get<Project>(`/projects/${projectId}`),
  createProject: (payload: ProjectPayload) => api.post<Project>('/projects', payload),
  updateProject: (projectId: number, payload: ProjectPayload) =>
    api.put<Project>(`/projects/${projectId}`, payload),
};
