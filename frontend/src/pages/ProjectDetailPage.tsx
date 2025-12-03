import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Chip,
  Divider,
  Tabs,
  Tab,
  Typography,
  Button,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projectsApi';
import { tasksApi } from '../api/tasksApi';
import TaskTable from '../components/tasks/TaskTable';
import TaskFilterBar from '../components/tasks/TaskFilterBar';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import GanttChart from '../components/gantt/GanttChart';
import { Task, TaskFilterState, TaskQueryFilters, TaskStatus } from '../types/task';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const pid = Number(projectId);
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [toast, setToast] = useState<string | null>(null);

  const projectQuery = useQuery({
    queryKey: ['project', pid],
    queryFn: async () => {
      const { data } = await projectsApi.getProject(pid);
      return data;
    },
    enabled: !!pid,
  });

  const searchKey = searchParams.toString();

  const parsedFilterState: TaskFilterState = useMemo(() => {
    const statusParam = searchParams.get('status');
    const assigneesParam = searchParams.get('assignees');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const statuses = statusParam?.length
      ? (statusParam.split(',').filter(Boolean) as TaskStatus[])
      : (['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]);

    const assigneeIds = assigneesParam
      ? assigneesParam
          .split(',')
          .map((id) => Number(id))
          .filter((n) => !Number.isNaN(n))
      : [];

    return {
      statuses,
      assigneeIds,
      dateRange: [from ? new Date(from) : null, to ? new Date(to) : null],
    };
  }, [searchKey]);

  const normalizedFilters = useMemo(
    () => ({
      statuses: [...parsedFilterState.statuses].sort(),
      assigneeIds: [...parsedFilterState.assigneeIds].sort(),
      dateRange: parsedFilterState.dateRange,
    }),
    [parsedFilterState],
  );

  const taskFilters: TaskQueryFilters = useMemo(
    () => ({
      assigneeId:
        normalizedFilters.assigneeIds.length === 1
          ? normalizedFilters.assigneeIds[0]
          : undefined,
      status:
        normalizedFilters.statuses.length === 1
          ? normalizedFilters.statuses[0]
          : undefined,
      from: normalizedFilters.dateRange[0]?.toISOString(),
      to: normalizedFilters.dateRange[1]?.toISOString(),
    }),
    [normalizedFilters],
  );

  const queryKeyFilters = useMemo(
    () => ({
      statuses: normalizedFilters.statuses.join(','),
      assignees: normalizedFilters.assigneeIds.join(','),
      from: normalizedFilters.dateRange[0]?.toISOString() || null,
      to: normalizedFilters.dateRange[1]?.toISOString() || null,
    }),
    [normalizedFilters],
  );

  const setFiltersToSearchParams = (next: TaskFilterState) => {
    const params = new URLSearchParams(searchParams);
    if (next.statuses.length && next.statuses.length < 3) {
      params.set('status', next.statuses.join(','));
    } else {
      params.delete('status');
    }

    if (next.assigneeIds.length) {
      params.set('assignees', next.assigneeIds.join(','));
    } else {
      params.delete('assignees');
    }

    if (next.dateRange[0]) {
      params.set('from', next.dateRange[0].toISOString());
    } else {
      params.delete('from');
    }

    if (next.dateRange[1]) {
      params.set('to', next.dateRange[1].toISOString());
    } else {
      params.delete('to');
    }

    setSearchParams(params, { replace: true });
  };

  const tasksQuery = useQuery({
    queryKey: ['tasks', pid, queryKeyFilters],
    queryFn: async () => {
      const { data } = await tasksApi.getTasks(pid, taskFilters);
      return data;
    },
    enabled: !!pid,
  });

  const ganttQuery = useQuery({
    queryKey: ['gantt', pid, queryKeyFilters],
    queryFn: async () => {
      const { data } = await tasksApi.getGantt(pid, taskFilters);
      return data;
    },
    enabled: !!pid,
  });

  const createTaskMutation = useMutation({
    mutationFn: (payload: any) => tasksApi.createTask(pid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', pid] });
      queryClient.invalidateQueries({ queryKey: ['gantt', pid] });
      setDialogOpen(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (payload: any) => tasksApi.updateTask(editingTask!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', pid] });
      queryClient.invalidateQueries({ queryKey: ['gantt', pid] });
      setDialogOpen(false);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => tasksApi.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', pid] });
      queryClient.invalidateQueries({ queryKey: ['gantt', pid] });
    },
  });

  const ganttUpdateMutation = useMutation({
    mutationFn: ({ taskId, startDate, endDate }: { taskId: number; startDate?: string; endDate?: string }) =>
      tasksApi.updateTask(taskId, { startDate, endDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', pid] });
      queryClient.invalidateQueries({ queryKey: ['gantt', pid] });
      setToast('작업 기간이 업데이트되었습니다.');
    },
    onError: () => {
      setToast('작업 기간 업데이트에 실패했습니다. 다시 시도해주세요.');
    },
  });

  if (!pid) return <Alert severity="error">잘못된 프로젝트 ID</Alert>;

  return (
    <Box>
      <Button onClick={() => navigate('/projects')} sx={{ mb: 2 }}>
        ← 프로젝트 목록으로
      </Button>
      {projectQuery.data && (
        <Box mb={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h5">{projectQuery.data.name}</Typography>
            <Chip label={projectQuery.data.status} color="info" />
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {projectQuery.data.description}
          </Typography>
          <Typography variant="caption">기간: {projectQuery.data.startDate?.split('T')[0]} ~ {projectQuery.data.endDate?.split('T')[0]}</Typography>
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
        <Tab label="업무 목록" />
        <Tab label="간트 차트" />
      </Tabs>

      <TaskFilterBar
        filters={parsedFilterState}
        onChangeAssignees={(ids) =>
          setFiltersToSearchParams({ ...parsedFilterState, assigneeIds: ids })
        }
        onChangeStatus={(status) =>
          setFiltersToSearchParams({ ...parsedFilterState, statuses: status })
        }
        onChangeDateRange={(range) =>
          setFiltersToSearchParams({ ...parsedFilterState, dateRange: range })
        }
      />

      {tab === 0 && (
        <>
          <Button variant="contained" sx={{ mb: 1 }} onClick={() => { setEditingTask(undefined); setDialogOpen(true); }}>
            업무 추가
          </Button>
          <TaskTable
            tasks={tasksQuery.data || []}
            onEdit={(task) => { setEditingTask(task); setDialogOpen(true); }}
            onDelete={(taskId) => deleteTaskMutation.mutate(taskId)}
          />
        </>
      )}

      {tab === 1 && (
        <GanttChart
          tasks={ganttQuery.data || []}
          onChangeDates={(taskId, start, end) =>
            ganttUpdateMutation.mutateAsync({
              taskId,
              startDate: start?.toISOString(),
              endDate: end?.toISOString(),
            })
          }
          updatingTaskId={ganttUpdateMutation.variables?.taskId}
          isUpdating={ganttUpdateMutation.isPending}
        />
      )}

      <TaskFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={editingTask}
        onSubmit={(payload) => {
          if (editingTask) {
            updateTaskMutation.mutate(payload);
          } else {
            createTaskMutation.mutate(payload);
          }
        }}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        message={toast}
      />
    </Box>
  );
};

export default ProjectDetailPage;
