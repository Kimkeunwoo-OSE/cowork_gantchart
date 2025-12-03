import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskAssigneesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTask(taskId: number) {
    return this.prisma.taskAssignee.findMany({
      where: { taskId },
      include: { user: true },
    });
  }
}
