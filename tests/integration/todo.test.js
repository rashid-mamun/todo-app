const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user');
const bcrypt = require('bcrypt');
const messages = require('../../src/constants/messages');

describe('User Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users/signup')
        .send({
          name: 'Test User',
          username: 'testuser',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        status: 'success',
        data: null,
        message: messages.SUCCESS.SIGNUP,
      });

      const user = await User.findOne({ username: 'testuser' });
      expect(user).toBeTruthy();
      expect(user.name).toBe('Test User');
      expect(await bcrypt.compare('password123', user.password)).toBe(true);
    });

    it('should return 400 if username exists', async () => {
      await User.create({
        name: 'Existing User',
        username: 'testuser',
        password: 'password123',
      });

      const res = await request(app)
        .post('/api/users/signup')
        .send({
          name: 'Test User',
          username: 'testuser',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: 'error',
        message: messages.ERROR.USER_EXISTS,
      });
    });

    it('should return 400 for invalid password', async () => {
      const res = await request(app)
        .post('/api/users/signup')
        .send({
          name: 'Test User',
          username: 'testuser',
          password: 'short',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Password must be at least 6 characters');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Test User',
        username: 'testuser',
        password: hashedPassword,
      });
    });

    it('should login user and return token', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        data: { access_token: expect.any(String) },
        message: messages.SUCCESS.LOGIN,
      });
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        status: 'error',
        message: messages.ERROR.AUTH_FAILED,
      });
    });

    it('should return 429 after too many login attempts', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/users/login')
          .send({
            username: 'testuser',
            password: 'wrongpassword',
          });
      }

      const res = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(res.status).toBe(429);
      expect(res.body).toEqual({
        status: 'error',
        message: messages.ERROR.TOO_MANY_LOGIN_ATTEMPTS,
      });
    });
  });
});