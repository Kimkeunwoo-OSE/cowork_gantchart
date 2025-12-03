import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../../types/task';

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const TaskTable = ({ tasks, onEdit, onDelete }: Props) => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>제목</TableCell>
          <TableCell>상태</TableCell>
          <TableCell>우선순위</TableCell>
          <TableCell>기간</TableCell>
          <TableCell>담당자</TableCell>
          <TableCell align="right">액션</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id} hover>
            <TableCell>{task.title}</TableCell>
            <TableCell>
              <Chip label={task.status} size="small" />
            </TableCell>
            <TableCell>{task.priority}</TableCell>
            <TableCell>
              {task.startDate?.split('T')[0]} ~ {task.endDate?.split('T')[0]}
            </TableCell>
            <TableCell>{task.assignees.map((a) => a.name).join(', ')}</TableCell>
            <TableCell align="right">
              <IconButton size="small" onClick={() => onEdit(task)}>
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => onDelete(task.id)}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default TaskTable;
