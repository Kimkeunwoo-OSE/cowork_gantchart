import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ProjectPayload, ProjectStatus } from '../../types/project';

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: ProjectPayload;
  onSubmit: (payload: ProjectPayload) => void;
  isSubmitting?: boolean;
}

const defaultForm: ProjectPayload = {
  name: '',
  description: '',
  status: 'ACTIVE',
  startDate: null,
  endDate: null,
};

const ProjectFormDialog = ({ open, onClose, initialData, onSubmit, isSubmitting }: Props) => {
  const [form, setForm] = useState<ProjectPayload>(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({ ...defaultForm, ...initialData });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({ ...form, startDate: form.startDate || undefined, endDate: form.endDate || undefined });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>프로젝트 생성</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="이름"
                required
                fullWidth
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="설명"
                fullWidth
                multiline
                minRows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="상태"
                select
                fullWidth
                value={form.status || 'ACTIVE'}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as ProjectStatus }))}
              >
                {(['ACTIVE', 'COMPLETED', 'ON_HOLD'] as ProjectStatus[]).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="시작일"
                value={form.startDate ? new Date(form.startDate) : null}
                onChange={(date) =>
                  setForm((prev) => ({ ...prev, startDate: date ? date.toISOString() : null }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="종료일"
                value={form.endDate ? new Date(form.endDate) : null}
                onChange={(date) => setForm((prev) => ({ ...prev, endDate: date ? date.toISOString() : null }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" variant="contained" disabled={!form.name.trim() || isSubmitting}>
            저장
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectFormDialog;
