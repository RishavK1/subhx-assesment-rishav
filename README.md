# Secure Authentication System

A full-stack authentication system built with Next.js on the frontend and Node.js + Express on the backend.

It includes:

- user registration
- login with JWT access token
- refresh-token session flow
- authenticated user profile
- logout with token revocation
- Redis-backed rate limiting
- IP whitelisting
- CSRF protection for cookie-based auth actions

## Tech Stack

Frontend:

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Axios
- Zustand

Backend:

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- Redis
- JWT
- bcrypt
- Helmet
- CORS
- Morgan
- express-rate-limit
- Zod

## Project Structure

```text
.
├── backend
│   ├── postman
│   │   └── auth.postman_collection.json
│   ├── src
│   │   └── app
│   │       ├── common
│   │       │   ├── clients
│   │       │   ├── config
│   │       │   ├── constants
│   │       │   ├── helpers
│   │       │   ├── middlewares
│   │       │   └── types
│   │       ├── features
│   │       │   └── auth
│   │       ├── router
│   │       └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend
│   ├── src
│   │   ├── app
│   │   │   ├── api
│   │   │   ├── components
│   │   │   ├── layouts
│   │   │   ├── router
│   │   │   ├── store
│   │   │   ├── types
│   │   │   └── utils
│   │   ├── features
│   │   │   └── auth
│   │   └── middleware.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## Features Implemented

### Backend

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/health`
- bcrypt password hashing
- JWT access tokens
- Redis-backed refresh-session storage
- Redis access-token blacklist
- Redis-backed rate limiting
- IP whitelist middleware
- centralized error handling
- request logging with Morgan
- Helmet and CORS
- Zod request validation

### Frontend

- register page with validation and error handling
- login page with validation and error handling
- protected dashboard route
- Zustand auth state
- access token stored in memory
- refresh token handled through HttpOnly cookie
- automatic token refresh with Axios interceptors
- logout flow with redirect to login
- responsive UI for desktop and mobile

## Authentication Flow

1. A user registers with name, email, and password.
2. The backend validates input, hashes the password, and stores the user in MongoDB.
3. On login, the backend verifies credentials and issues:
   - a short-lived JWT access token
   - a refresh token stored in an HttpOnly cookie
4. Refresh session data is stored in Redis.
5. Protected requests use the access token.
6. When the access token expires, the frontend refreshes the session through `/api/auth/refresh`.
7. On logout, the refresh session is removed and the access token is blacklisted.

## Environment Setup

### Backend

Create `backend/.env` from `backend/.env.example`.

Required values:

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `REDIS_URL`
- `CORS_ORIGIN`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_TTL_MINUTES`
- `REFRESH_TOKEN_TTL_DAYS`
- `REFRESH_COOKIE_NAME`
- `CSRF_COOKIE_NAME`
- `AUTH_HINT_COOKIE_NAME`
- `BCRYPT_SALT_ROUNDS`
- `IP_WHITELIST`

### Frontend

Create `frontend/.env.local` from `frontend/.env.example`.

Required values:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_AUTH_HINT_COOKIE_NAME`
- `NEXT_PUBLIC_CSRF_COOKIE_NAME`

## How To Run

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Start backend

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:4000
```

### 3. Install frontend dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 4. Start frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

## How To Test

1. Open `http://localhost:3000`
2. Register a new user
3. Login with the same credentials
4. Verify dashboard access
5. Refresh the page and confirm the session is restored
6. Logout and confirm redirect to login

You can also test the backend APIs using:

- `backend/postman/auth.postman_collection.json`

## Useful Commands

Backend:

```bash
cd backend
npm run typecheck
npm run build
```

Frontend:

```bash
cd frontend
npm run typecheck
npm run build
```

