import { useState } from 'react';
import { Box, Button, Grid, TextField, MenuItem, Typography, Snackbar, Alert } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projectsApi';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFormDialog from '../components/projects/ProjectFormDialog';
import { ProjectFilters, ProjectPayload, ProjectStatus } from '../types/project';
import { useNavigate } from 'react-router-dom';

const defaultFilters: ProjectFilters = { status: undefined, keyword: '' };
const defaultProjectPayload: ProjectPayload = {
  name: '',
  description: '',
  status: 'ACTIVE',
  startDate: null,
  endDate: null,
};

const ProjectListPage = () => {
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [createOpen, setCreateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    mutationFn: (payload: ProjectPayload) => projectsApi.createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setCreateOpen(false);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || '프로젝트 생성에 실패했습니다.';
      setError(Array.isArray(message) ? message.join(', ') : message);
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
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
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

      <ProjectFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        initialData={defaultProjectPayload}
        onSubmit={(payload) => createMutation.mutate(payload)}
        isSubmitting={createMutation.isPending}
      />

      <Snackbar open={!!error} autoHideDuration={2500} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectListPage;
