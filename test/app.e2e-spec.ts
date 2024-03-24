
require('dotenv').config({ path: '/.env' });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; 

describe('Authentication and User Management E2E Tests', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST user - Create user', () => {
    return request(app.getHttpServer())
      .post('/user') 
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(HttpStatus.CREATED); // Verify that your application returns the "Created" status upon successful user creation
  });

  it('/POST auth/login - User login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login') 
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(HttpStatus.OK); // Confirm that your login endpoint responds with "OK" on success

    jwtToken = response.body.access_token; // Make sure this matches how your application returns the token
    expect(jwtToken).toBeDefined();
  });

  it('/GET auth/me - Get current user', () => {
    return request(app.getHttpServer())
      .get('/auth/me') 
      .set('Authorization', `Bearer ${jwtToken}`) // Use the JWT token from the login response
      .expect(HttpStatus.OK) // Check for an "OK" response
      .expect((res) => {
        expect(res.body).toMatchObject({
          email: 'test@example.com',
          
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
