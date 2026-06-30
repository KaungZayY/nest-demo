import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateProfileDto } from './dto/create-profile-dto';
import { UpdateProfileDto } from './dto/update-profile-dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  private profiles = [
    {
      id: randomUUID(),
      name: 'Bruh',
      description: 'He is a bigger',
    },
    {
      id: randomUUID(),
      name: 'Twin',
      description: 'He is a real trigger',
    },
    {
      id: randomUUID(),
      name: 'Bigga',
      description: 'He is my ninja',
    },
  ];

  async findAll() {
    return this.prisma.profile.findMany();
  }

  async findOne(id: number) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found.`);
    }
    return profile;
  }

  async save(CreateProfileDto: CreateProfileDto) {
    return this.prisma.profile.create({
      data: {
        name: CreateProfileDto.name,
        description: CreateProfileDto.description,
      },
    });
  }

  async edit(id: number, UpdateProfileDto: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: {
        id,
      },
      data: {
        name: UpdateProfileDto.name,
        description: UpdateProfileDto.description,
      },
    });
  }

  async destroy(id: number) {
    return this.prisma.profile.delete({
      where: {
        id,
      },
    });
  }
}
