import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TaskAssigneesService } from './task-assignees.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('task-assignees')
export class TaskAssigneesController {
  constructor(private readonly taskAssigneesService: TaskAssigneesService) {}

  @Get('tasks/:taskId')
  findByTask(@Param('taskId') taskId: string) {
    return this.taskAssigneesService.findByTask(Number(taskId));
  }
}
