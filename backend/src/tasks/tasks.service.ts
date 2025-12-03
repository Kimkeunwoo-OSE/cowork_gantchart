import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskPriority, TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async setAssignees(taskId: number, assigneeIds?: number[]) {
    if (!assigneeIds) return;
    await this.prisma.taskAssignee.deleteMany({ where: { taskId } });
    if (assigneeIds.length > 0) {
      await this.prisma.taskAssignee.createMany({
        data: assigneeIds.map((userId) => ({ taskId, userId })),
      });
    }
  }

  async findByProject(
    projectId: number,
    filters: {
      status?: TaskStatus;
      assigneeId?: number;
      from?: string;
      to?: string;
    },
  ) {
    const where: any = { projectId };
    if (filters.status) where.status = filters.status;
    if (filters.assigneeId)
      where.assignees = { some: { userId: filters.assigneeId } };
    if (filters.from || filters.to) {
      where.AND = [] as any[];
      if (filters.from) {
        where.AND.push({ startDate: { gte: new Date(filters.from) } });
      }
      if (filters.to) {
        where.AND.push({ endDate: { lte: new Date(filters.to) } });
      }
    }
    return this.prisma.task.findMany({
      where,
      include: { assignees: { include: { user: true } } },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { assignees: { include: { user: true } } },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async create(projectId: number, dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        status: dto.status || TaskStatus.TODO,
        priority: dto.priority || TaskPriority.MEDIUM,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        progress: dto.progress,
      },
    });
    await this.setAssignees(task.id, dto.assigneeIds);
    return this.findOne(task.id);
  }

  async update(id: number, dto: UpdateTaskDto) {
    await this.findOne(id);
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        progress: dto.progress,
      },
    });
    await this.setAssignees(task.id, dto.assigneeIds);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.taskAssignee.deleteMany({ where: { taskId: id } });
    return this.prisma.task.delete({ where: { id } });
  }

  async getGanttData(projectId: number) {
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      include: { assignees: { include: { user: true } } },
    });
    return tasks.map((task) => ({
      id: task.id,
      name: task.title,
      start: task.startDate?.toISOString().split('T')[0],
      end: task.endDate?.toISOString().split('T')[0],
      progress: task.progress,
      assignees: task.assignees.map((a) => ({ id: a.user.id, name: a.user.name })),
    }));
  }
}
