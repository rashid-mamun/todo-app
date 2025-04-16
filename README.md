# Todo Application  🚀 
A robust RESTful API for managing todos with user authentication, built with Node.js, Express, and MongoDB.

## Overview 🌟

The Todo Application lets users create, manage, and delete todos with secure authentication using JWT. It supports avatar uploads, input validation, and rate-limiting, all wrapped in a clean, scalable codebase. 🏗️ Deploy it locally or with Docker for a seamless experience.

## Features ✅

- **User Management**: Signup, login, and avatar upload with JWT. 
- **Todo Management**: Create, read, update, delete todos per user. 
- **Security**: Rate-limiting, secure headers, and query sanitization. 
- **Performance**: Indexed database, lean queries, connection pooling. 
- **Reliability**: Error handling and graceful shutdown. 
- **Testing**: Integration tests with Jest and in-memory MongoDB. 
- **Logging**: Request tracking with IDs and performance metrics. 
- **Deployment**: Docker and Docker Compose for easy setup. 

## Tech Stack 🛠️

- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Validation**: Joi
- **File Uploads**: Multer
- **Logging**: Winston
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize
- **Testing**: Jest, Supertest, MongoDB Memory Server
- **Deployment**: Docker, Docker Compose

## Setup ⚙️

### Prerequisites 📋

- **Node.js** (&gt;= 18.x): Download 
- **MongoDB** (&gt;= 4.x): Local Install or MongoDB Atlas 
- **Docker** (optional): Install Docker 
- **Git**: For cloning the repo 

### Local Installation 💻

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/rashid-mamun/todo-app.git
   cd todo-app
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**: Create a `.env` file:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/todos
   JWT_SECRET=your_secure_jwt_secret_32_chars_min
   NODE_ENV=development
   ```

   - `PORT`: Server port (default: 5000) 
   - `MONGO_URI`: MongoDB connection string 
   - `JWT_SECRET`: Secure key for JWT (32+ chars) 
   - `NODE_ENV`: `development`, `production`, or `test` 

4. **Create Directories**:

   ```bash
   mkdir uploads logs
   ```

5. **Start MongoDB**: Ensure MongoDB is running locally or via Atlas. 

6. **Run the Application**:

   ```bash
   npm start
   ```

   For development with auto-restart:

   ```bash
   npm run start-dev
   ```

   Access at `http://localhost:5000`. 

### Docker Setup 🐳

1. **Verify Docker Installation**:

   ```bash
   docker --version
   docker-compose --version
   ```

2. **Configure Environment Variables**: Update `.env`:

   ```env
   PORT=5000
   MONGO_URI=mongodb://mongo:27017/todos
   JWT_SECRET=your_secure_jwt_secret_32_chars_min
   NODE_ENV=development
   ```

3. **Start Services**:

   ```bash
   docker-compose up --build
   ```

4. **Access the API**: Available at `http://localhost:5000`. 

5. **Stop Services**:

   ```bash
   docker-compose down
   ```

## Running Tests 🧪

Integration tests cover user and todo routes using Jest and in-memory MongoDB.

1. **Run Tests**:

   ```bash
   npm test
   ```

2. **View Coverage**:

   ```bash
   npm run test:coverage
   ```

   Reports are in `coverage/`. 📈

## API Endpoints 📡

### Authentication 🔐

Protected routes need a JWT:

```
Authorization: Bearer <token>
```

Get a token from `/api/users/login`.

### User Routes 👤

| Method | Endpoint | Description | Request Body/Example | Response Example |
| --- | --- | --- | --- | --- |
| POST | `/api/users/signup` | Register a new user | `{ "name": "John Doe", "username": "john", "password": "secure123" }` | `{ "status": "success", "data": null, "message": "Signup successful" }` |
| POST | `/api/users/login` | Login and get JWT | `{ "username": "john", "password": "secure123" }` | `{ "status": "success", "data": { "access_token": "..." }, "message": "Login successful" }` |
| POST | `/api/users/avatar` | Upload avatar (JWT) | Form-data: `avatar` (.jpg/.png/.jpeg) | `{ "status": "success", "data": { "avatar": "/uploads/..." }, "message": "Avatar uploaded successfully" }` |

- **Notes**:
  - Login: Limited to 5 attempts per 15 mins/IP. 
  - Avatar: Max 1MB, images only. 

### Todo Routes 📝

All routes require JWT.

| Method | Endpoint | Description | Request Body/Example | Response Example |
| --- | --- | --- | --- | --- |
| GET | `/api/todos` | Get user's todos | None | `{ "status": "success", "data": [{ "title": "...", ... }], "message": "Todos retrieved successfully" }` |
| GET | `/api/todos/:id` | Get todo by ID | None | `{ "status": "success", "data": { "title": "...", ... }, "message": "Todos retrieved successfully" }` |
| POST | `/api/todos` | Create a todo | `{ "title": "Buy groceries", "description": "...", "status": "active" }` | `{ "status": "success", "data": null, "message": "Todo created successfully" }` |
| POST | `/api/todos/all` | Create multiple todos | `[{ "title": "...", ... }, ...]` | `{ "status": "success", "data": null, "message": "Todos created successfully" }` |
| PUT | `/api/todos/:id` | Update a todo | `{ "title": "Updated title", "description": "...", "status": "inactive" }` | `{ "status": "success", "data": null, "message": "Todo updated successfully" }` |
| DELETE | `/api/todos/:id` | Delete a todo | None | `{ "status": "success", "data": null, "message": "Todo deleted successfully" }` |

- **Notes**:
  - Todos are user-specific. 
  - `:id` must be a valid ObjectID. 
  - Rate-limit: 100 requests per 15 mins/IP. ⏱

**Example Request** (Create Todo):

```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs", "status": "active"}'
```

**Response**:

```json
{
  "status": "success",
  "data": null,
  "message": "Todo created successfully"
}