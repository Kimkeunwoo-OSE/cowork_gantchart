import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projectsApi';
import ProjectCard from '../components/projects/ProjectCard';
import { ProjectFilters, ProjectPayload, ProjectStatus } from '../types/project';
import { useNavigate } from 'react-router-dom';

const ProjectListPage = () => {
  const [filters, setFilters] = useState<ProjectFilters>({ status: undefined, keyword: '' });
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<ProjectPayload>({ name: '', description: '', status: 'ACTIVE' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const { data } = await projectsApi.getProjects(filters);
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: () => projectsApi.createProject(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setCreateOpen(false);
    },
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">프로젝트 목록</Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          새 프로젝트 추가
        </Button>
      </Box>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="상태"
          select
          size="small"
          sx={{ minWidth: 160 }}
          value={filters.status || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as ProjectStatus }))}
        >
          <MenuItem value="">전체</MenuItem>
          {(['ACTIVE', 'COMPLETED', 'ON_HOLD'] as ProjectStatus[]).map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="검색"
          size="small"
          value={filters.keyword || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
        />
      </Box>
      <Grid container spacing={2}>
        {projectsQuery.data?.map((project) => (
          <Grid item xs={12} md={6} key={project.id}>
            <ProjectCard project={project} onClick={() => navigate(`/projects/${project.id}`)} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth>
        <DialogTitle>프로젝트 생성</DialogTitle>
        <DialogContent>
          <TextField
            label="이름"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            label="설명"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <TextField
            label="상태"
            select
            fullWidth
            margin="normal"
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as ProjectStatus }))}
          >
            {(['ACTIVE', 'COMPLETED', 'ON_HOLD'] as ProjectStatus[]).map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>취소</Button>
          <Button onClick={() => createMutation.mutate()} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectListPage;
