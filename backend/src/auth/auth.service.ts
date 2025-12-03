import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeUser(user: User) {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async signup(data: SignupDto): Promise<{ accessToken: string; user: Omit<User, 'passwordHash'> }> {
    const normalizedEmail = data.email.trim().toLowerCase();
    try {
      const existing = await this.usersService.findByEmail(normalizedEmail);
      if (existing) {
        throw new ConflictException('Email already registered');
      }

      const passwordHash = await bcrypt.hash(data.password, 10);
      const created = await this.usersService.create({
        name: data.name.trim(),
        email: normalizedEmail,
        passwordHash,
      });

      const payload = { sub: created.id, email: created.email, role: created.role };
      console.log('Signup success for', normalizedEmail);
      return {
        accessToken: this.jwtService.sign(payload),
        user: this.sanitizeUser(created),
      };
    } catch (error) {
      console.error('Signup failed:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      if ((error as any)?.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }
      throw new BadRequestException('Signup failed');
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(data: LoginDto) {
    const user = await this.validateUser(data.email, data.password);
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: this.sanitizeUser(user),
    };
  }

  async me(userId: number) {
    return this.usersService.findById(userId);
  }
}
