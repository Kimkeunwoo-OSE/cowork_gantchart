import { Module } from '@nestjs/common';
import { TaskAssigneesService } from './task-assignees.service';
import { TaskAssigneesController } from './task-assignees.controller';

@Module({
  providers: [TaskAssigneesService],
  controllers: [TaskAssigneesController],
  exports: [TaskAssigneesService],
})
export class TaskAssigneesModule {}
