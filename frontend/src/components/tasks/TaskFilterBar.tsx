import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Chip,
  OutlinedInput,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { useQuery } from '@tanstack/react-query';
import { TaskFilterState, TaskStatus } from '../../types/task';
import api from '../../api/axiosInstance';

interface Props {
  filters: TaskFilterState;
  onChangeAssignees: (ids: number[]) => void;
  onChangeStatus: (status: TaskStatus[]) => void;
  onChangeDateRange: (range: [Date | null, Date | null]) => void;
}

const TaskFilterBar = ({
  filters,
  onChangeAssignees,
  onChangeStatus,
  onChangeDateRange,
}: Props) => {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<{ id: number; name: string }[]>('/users');
      return data;
    },
  });

  const { assigneeIds, status, dateRange } = filters;

  const toggleStatus = (value: TaskStatus) => {
    if (status.includes(value)) {
      onChangeStatus(status.filter((s) => s !== value));
    } else {
      onChangeStatus([...status, value]);
    }
  };

  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ mb: 2 }} alignItems="center">
      <FormControl sx={{ minWidth: 160 }} size="small">
        <InputLabel id="assignee-select">담당자</InputLabel>
        <Select
          labelId="assignee-select"
          multiple
          value={assigneeIds}
          onChange={(e) => onChangeAssignees(e.target.value as number[])}
          input={<OutlinedInput label="담당자" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const name = usersQuery.data?.find((u) => u.id === value)?.name || value;
                return <Chip key={value} label={name} size="small" />;
              })}
            </Box>
          )}
        >
          {usersQuery.data?.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              <Checkbox checked={assigneeIds.indexOf(user.id) > -1} />
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl component="fieldset">
        <FormGroup row>
          {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((s) => (
            <FormControlLabel
              key={s}
              control={<Checkbox checked={status.includes(s)} onChange={() => toggleStatus(s)} />}
              label={s}
            />
          ))}
        </FormGroup>
      </FormControl>

      <DateRangePicker
        value={dateRange}
        onChange={(range) => onChangeDateRange(range as [Date | null, Date | null])}
        slotProps={{
          textField: {
            size: 'small',
          },
        }}
      />
    </Stack>
  );
};

export default TaskFilterBar;
