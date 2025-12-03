import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; email: string; passwordHash?: string; role?: Role }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash:
          data.passwordHash || (await bcrypt.hash(data['password'] as string, 10)),
        role: data.role || 'MEMBER',
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
