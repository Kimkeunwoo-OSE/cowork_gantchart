import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { GanttTaskItem } from '../../types/task';
import { Gantt, Task as GanttTask } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

interface Props {
  tasks: GanttTaskItem[];
  onChangeDates?: (taskId: number, start?: Date, end?: Date) => Promise<unknown>;
  updatingTaskId?: number;
  isUpdating?: boolean;
}

const GanttChart = ({ tasks, onChangeDates, updatingTaskId, isUpdating }: Props) => {
  const [selected, setSelected] = useState<GanttTaskItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ganttTasks: GanttTask[] = tasks.map((t) => ({
    id: `${t.id}`,
    name: t.name,
    start: t.start ? new Date(t.start) : new Date(),
    end: t.end ? new Date(t.end) : new Date(),
    progress: t.progress,
    isDisabled: false,
    type: 'task',
  }));

  const handleDateChange = async (task: GanttTask) => {
    if (!onChangeDates) return task;

    try {
      await onChangeDates(Number(task.id), task.start, task.end);
    } catch (e) {
      setError('날짜를 업데이트하지 못했습니다. 다시 시도해주세요.');
    }
    return task;
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Gantt
        tasks={ganttTasks}
        onClick={(task) => setSelected(tasks.find((t) => `${t.id}` === task.id) || null)}
        onDateChange={handleDateChange}
      />
      {isUpdating && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <CircularProgress size={36} />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {updatingTaskId ? `작업 #${updatingTaskId} 업데이트 중...` : '업데이트 중...'}
          </Typography>
        </Box>
      )}
      <Dialog open={!!selected} onClose={() => setSelected(null)}>
        <DialogTitle>작업 상세</DialogTitle>
        <DialogContent>
          {selected && (
            <>
              <Typography variant="subtitle1">{selected.name}</Typography>
              <Typography variant="body2">기간: {selected.start} ~ {selected.end}</Typography>
              <Typography variant="body2">진척도: {selected.progress}%</Typography>
              <Typography variant="body2">
                담당자: {selected.assignees.map((a) => a.name).join(', ') || '미지정'}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Snackbar open={!!error} autoHideDuration={2500} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GanttChart;
