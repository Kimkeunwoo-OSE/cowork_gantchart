import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Slider,
  Chip,
  OutlinedInput,
  Box,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Task, TaskFormInput, TaskPriority, TaskStatus } from '../../types/task';
import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: TaskFormInput) => void;
  initialData?: Task;
}

const defaultForm: TaskFormInput = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  startDate: null,
  endDate: null,
  progress: 0,
  assigneeIds: [],
};

const TaskFormDialog = ({ open, onClose, onSubmit, initialData }: Props) => {
  const [assigneeOptions, setAssigneeOptions] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState<TaskFormInput>(defaultForm);

  useEffect(() => {
    api.get<{ id: number; name: string }[]>('/users').then((res) => setAssigneeOptions(res.data));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        status: initialData.status,
        priority: initialData.priority,
        startDate: initialData.startDate || null,
        endDate: initialData.endDate || null,
        progress: initialData.progress,
        assigneeIds: initialData.assignees.map((a) => a.id),
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, open]);

  const handleChange = (field: keyof TaskFormInput, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initialData ? '업무 수정' : '업무 추가'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="제목"
              fullWidth
              required
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">상태</InputLabel>
              <Select
                labelId="status-label"
                value={form.status}
                label="상태"
                onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
              >
                {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="설명"
              fullWidth
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              margin="dense"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="priority-label">우선순위</InputLabel>
              <Select
                labelId="priority-label"
                value={form.priority}
                label="우선순위"
                onChange={(e) => handleChange('priority', e.target.value as TaskPriority)}
              >
                {(['LOW', 'MEDIUM', 'HIGH'] as TaskPriority[]).map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="assignee-label">담당자</InputLabel>
              <Select
                labelId="assignee-label"
                multiple
                value={form.assigneeIds || []}
                onChange={(e) => handleChange('assigneeIds', e.target.value as number[])}
                input={<OutlinedInput label="담당자" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as number[]).map((value) => {
                      const name = assigneeOptions.find((a) => a.id === value)?.name || value;
                      return <Chip key={value} label={name} size="small" />;
                    })}
                  </Box>
                )}
              >
                {assigneeOptions.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="시작일"
              value={form.startDate ? new Date(form.startDate) : null}
              onChange={(date) => handleChange('startDate', date ? date.toISOString() : null)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="종료일"
              value={form.endDate ? new Date(form.endDate) : null}
              onChange={(date) => handleChange('endDate', date ? date.toISOString() : null)}
            />
          </Grid>
          <Grid item xs={12}>
            <Slider
              value={form.progress}
              onChange={(_, value) => handleChange('progress', value as number)}
              valueLabelDisplay="auto"
              step={5}
              min={0}
              max={100}
              marks
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!form.title.trim()}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormDialog;
