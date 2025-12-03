export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface TaskAssigneeInfo {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate?: string;
  endDate?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  assignees: TaskAssigneeInfo[];
}

export interface TaskFilters {
  status?: TaskStatus;
  assigneeId?: number;
  from?: string;
  to?: string;
}

export interface TaskFilterState {
  statuses: TaskStatus[];
  assigneeIds: number[];
  dateRange: [Date | null, Date | null];
}

export interface TaskQueryFilters {
  status?: TaskStatus;
  assigneeId?: number;
  from?: string;
  to?: string;
}

export interface TaskFormInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: string | null;
  endDate?: string | null;
  progress: number;
  assigneeIds?: number[];
}

export type TaskUpdateInput = Partial<TaskFormInput>;

export interface GanttTaskItem {
  id: number;
  name: string;
  start: string | undefined;
  end: string | undefined;
  progress: number;
  assignees: TaskAssigneeInfo[];
}
