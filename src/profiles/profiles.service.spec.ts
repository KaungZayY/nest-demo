import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../prisma.service';

describe('ProfilesService', () => {
  let service: ProfilesService;

  const mockPrismaService = {
    profile: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all profiles', async () => {
      const profiles = [
        { id: 1, name: 'John', description: 'Developer' },
        { id: 2, name: 'Jane', description: 'Designer' },
      ];

      mockPrismaService.profile.findMany.mockResolvedValue(profiles);

      expect(await service.findAll()).toEqual(profiles);
      expect(mockPrismaService.profile.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a profile', async () => {
      const profile = {
        id: 1,
        name: 'John',
        description: 'Developer',
      };

      mockPrismaService.profile.findUnique.mockResolvedValue(profile);

      expect(await service.findOne(1)).toEqual(profile);
      expect(mockPrismaService.profile.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('save', () => {
    it('should save new user', async () => {
      const dto = {
        name: 'Jack',
        description: 'Developer',
      };
      const profile = {
        id: 3,
        ...dto,
      };

      mockPrismaService.profile.create.mockResolvedValue(profile);

      expect(await service.save(dto)).toEqual(profile);
      expect(mockPrismaService.profile.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('edit', () => {
    it('should update the user profile', async () => {
      const dto = {
        name: 'Updated',
        description: 'Updated description',
      };
      const profile = {
        id: 1,
        ...dto,
      };

      mockPrismaService.profile.update.mockResolvedValue(profile);
      expect(await service.edit(1, dto)).toEqual(profile);
      expect(mockPrismaService.profile.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });
  });

  describe('destroy', () => {
    it('should delete the user profile', async () => {
      const profile = {
        id: 1,
        name: 'John',
        description: 'Developer',
      };

      mockPrismaService.profile.delete.mockResolvedValue(profile);

      expect(await service.destroy(1)).toEqual(profile);

      expect(mockPrismaService.profile.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
