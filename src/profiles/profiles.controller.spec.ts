import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { ProfilesGuard } from './profiles.guard';

describe('ProfilesController', () => {
  let controller: ProfilesController;

  const mockProfileService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    edit: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide: ProfilesService,
          useValue: mockProfileService,
        },
      ],
    })
      .overrideGuard(ProfilesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProfilesController>(ProfilesController);

    jest.clearAllMocks();
  });

  it('should be declared', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all the profiles', async () => {
      const profiles = [
        { id: 1, name: 'John', description: 'Developer' },
        { id: 2, name: 'Jane', description: 'Designer' },
      ];

      mockProfileService.findAll.mockReturnValue(profiles);

      expect(await controller.findAll()).toEqual(profiles);
      expect(mockProfileService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return one profile', async () => {
      const profile = {
        id: 1,
        name: 'John',
        description: 'Developer',
      };

      mockProfileService.findOne.mockReturnValue(profile);

      expect(await controller.findOne(1)).toEqual(profile);
      expect(mockProfileService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should save a profile', async () => {
      const dto = {
        name: 'John',
        description: 'Developer',
      };
      const profile = {
        id: 1,
        ...dto,
      };

      mockProfileService.save.mockReturnValue(profile);

      expect(await controller.create(dto)).toEqual(profile);
      expect(mockProfileService.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update the profile', async () => {
      const dto = {
        name: 'Updated',
        description: 'Updated description',
      };
      const profile = {
        id: 1,
        ...dto,
      };

      mockProfileService.edit.mockReturnValue(profile);

      expect(await controller.update(1, dto)).toEqual(profile);
      expect(mockProfileService.edit).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete the profile', async () => {
      const profile = {
        id: 1,
        name: 'John',
        description: 'Developer',
      };

      mockProfileService.destroy.mockReturnValue(profile);

      expect(await controller.remove(1)).toEqual(profile);
      expect(mockProfileService.destroy).toHaveBeenCalledWith(1);
    });
  });
});
