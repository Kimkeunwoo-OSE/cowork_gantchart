import { Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { Project } from '../../types/project';

interface Props {
  project: Project;
  onClick?: () => void;
}

const statusColor: Record<Project['status'], 'default' | 'success' | 'warning' | 'info'> = {
  ACTIVE: 'info',
  COMPLETED: 'success',
  ON_HOLD: 'warning',
};

const ProjectCard = ({ project, onClick }: Props) => (
  <Card sx={{ cursor: 'pointer' }} onClick={onClick}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{project.name}</Typography>
        <Chip label={project.status} color={statusColor[project.status]} size="small" />
      </Stack>
      {project.description && (
        <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
          {project.description}
        </Typography>
      )}
      {(project.startDate || project.endDate) && (
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          기간: {project.startDate?.split('T')[0]} ~ {project.endDate?.split('T')[0]}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default ProjectCard;
