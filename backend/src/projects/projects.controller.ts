import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus, TaskStatus } from '@prisma/client';
import { TasksService } from '../tasks/tasks.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  findAll(@Query('status') status?: ProjectStatus, @Query('keyword') keyword?: string) {
    return this.projectsService.findAll({ status, keyword });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(Number(id));
  }

  @Get(':projectId/gantt')
  async gantt(
    @Param('projectId') projectId: string,
    @Query('status') status?: TaskStatus,
    @Query('assigneeId') assigneeId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.tasksService.getGanttData(Number(projectId), {
      status,
      assigneeId: assigneeId ? Number(assigneeId) : undefined,
      from,
      to,
    });
  }
}
