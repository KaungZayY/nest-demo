import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ProfilesGuard } from '../src/profiles/profiles.guard';
import { INestApplication } from '@nestjs/common';

describe('Profiles', () => {
  let app: INestApplication;
  let profileId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(ProfilesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/profiles (GET)', () => {
    it('should return all profiles', async () => {
      return request(app.getHttpServer())
        .get('/profiles')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/profiles (POST)', () => {
    it('should create a profile', async () => {
      const dto = {
        name: 'E2E Profile',
        description: 'E2E Test Data',
      };

      const response = await request(app.getHttpServer())
        .post('/profiles')
        .send(dto)
        .expect(201);

      profileId = response.body.id;

      expect(response.body.name).toBe(dto.name);
      expect(response.body.description).toBe(dto.description);
    });
  });

  describe('/profiles/:id (GET)', () => {
    it('should return the created profile', async () => {
      return request(app.getHttpServer())
        .get(`/profiles/${profileId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(profileId);
        });
    });
  });

  describe('/profiles/:id (PUT)', () => {
    it('should update the profile', async () => {
      const dto = {
        name: 'Updated',
        description: 'Updated description',
      };

      return request(app.getHttpServer())
        .put(`/profiles/${profileId}`)
        .send(dto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(dto.name);
          expect(res.body.description).toBe(dto.description);
          expect(res.body.id).toBe(profileId);
        });
    });
  });

  describe('/profiles/:id (DELETE)', () => {
    it('should delete the profile', async () => {
      await request(app.getHttpServer())
        .delete(`/profiles/${profileId}`)
        .expect(204);
    });

    it('should no longer exist after deletion', async () => {
      return request(app.getHttpServer())
        .get(`/profiles/${profileId}`)
        .expect(404);
    });
  });
});
