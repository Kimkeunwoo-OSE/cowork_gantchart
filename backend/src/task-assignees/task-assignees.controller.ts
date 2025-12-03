import { Controller, Get, Param } from '@nestjs/common';
import { TaskAssigneesService } from './task-assignees.service';

@Controller('task-assignees')
export class TaskAssigneesController {
  constructor(private readonly taskAssigneesService: TaskAssigneesService) {}

  @Get('tasks/:taskId')
  findByTask(@Param('taskId') taskId: string) {
    return this.taskAssigneesService.findByTask(Number(taskId));
  }
}
