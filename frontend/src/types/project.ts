export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  keyword?: string;
}

export interface ProjectPayload {
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
}
