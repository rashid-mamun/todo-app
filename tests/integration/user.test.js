const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user');
const Todo = require('../../src/models/todo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../src/config');
const messages = require('../../src/constants/messages');

describe('Todo Routes', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Todo.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test User',
      username: 'testuser',
      password: hashedPassword,
    });
    userId = user._id;

    token = jwt.sign(
      { username: 'testuser', userId },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description',
          status: 'active',
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        status: 'success',
        data: null,
        message: messages.SUCCESS.TODO_CREATED,
      });

      const todo = await Todo.findOne({ title: 'Test Todo' });
      expect(todo).toBeTruthy();
      expect(todo.user.toString()).toBe(userId.toString());
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description',
          status: 'invalid',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Status must be active or inactive');
    });
  });

  describe('GET /api/todos', () => {
    it('should get all todos for the user', async () => {
      await Todo.create({
        title: 'Test Todo',
        description: 'Test Description',
        status: 'active',
        user: userId,
      });

      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toMatchObject({
        title: 'Test Todo',
        description: 'Test Description',
        status: 'active',
      });
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should get a todo by ID', async () => {
      const todo = await Todo.create({
        title: 'Test Todo',
        description: 'Test Description',
        status: 'active',
        user: userId,
      });

      const res = await request(app)
        .get(`/api/todos/${todo._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({
        title: 'Test Todo',
        description: 'Test Description',
        status: 'active',
      });
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app)
        .get('/api/todos/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        message: messages.ERROR.TODO_NOT_FOUND,
      });
    });

    it('should return 400 for invalid ObjectID', async () => {
      const res = await request(app)
        .get('/api/todos/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: 'error',
        message: messages.ERROR.INVALID_ID,
      });
    });
  });
});