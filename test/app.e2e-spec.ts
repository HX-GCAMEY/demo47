import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Get /users/ Returns an array of users with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get('/users');
    console.log(req.body);

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });

  it('Post /users/signup creates a user with an OK status code', async () => {
    const req = await request(app.getHttpServer()).post('/users/signup').send({
      email: 'test@test.com',
      password: '123456',
      name: 'Test',
    });
    expect(req.status).toBe(201);
    expect(req.body).toBeInstanceOf(Object);
  });
});
