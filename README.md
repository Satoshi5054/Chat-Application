# Real-Time Chat Application

A full-stack chat application built with TypeScript, React, Express, Prisma, PostgreSQL, and Socket.IO.

It supports:
- Authentication with cookie-based JWT
- Conversations and message history
- Real-time messaging
- Online presence (who is online)
- Typing indicators
- Read status update in backend (stored in database)

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend
- Node.js + Express + TypeScript
- Socket.IO
- Prisma ORM
- PostgreSQL
- JWT + cookie-based auth

## Project Structure

```text
Chat Application/
  Backend/
    prisma/
    src/
      controller/
      middleware/
      routes/
      sockets/
  Frontend/
    src/
      features/
      services/
```

## How It Works

1. User logs in from frontend.
2. Backend sets an httpOnly token cookie.
3. Frontend connects to Socket.IO with credentials.
4. Socket middleware validates token from cookie.
5. Backend maps userId to socket.id for online presence.
6. Users join conversation rooms for real-time events.

## Realtime Features

### 1) Online Presence
- On socket connection, backend stores userId -> socket.id
- On disconnect, backend removes user from map
- Backend broadcasts online user IDs using event: online-users
- Frontend shows Online or Offline for direct chat member

### 2) Typing Indicator
- Frontend emits typing when user types
- Frontend emits stop-typing after short inactivity
- Backend relays to room (excluding sender) via:
  - user-typing
  - user-stop-typing

### 3) Read Status (Backend Update)
- Frontend emits mark-read when opening a conversation
- Backend finds latest message and updates ConversationMember.lastReadMessageId
- This update is persisted in database

## REST API (Current)

Base prefix: /api

### Auth
- POST /auth/register
- POST /auth/login
- GET /auth/me
- POST /auth/logout

### Conversations
- GET /conversations

### Messages
- GET /messages/:conversationId
- POST /messages

## Socket Events (Current)

Client -> Server:
- join-conversation (conversationId)
- leave-conversation (conversationId)
- typing (conversationId)
- stop-typing (conversationId)
- mark-read (conversationId)

Server -> Client:
- new-message (message)
- online-users (userId[])
- user-typing (userId)
- user-stop-typing (userId)
- messages-read ({ userId, messageId })

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL running locally or remotely

## Environment Variables

Create a .env file in Backend:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
JWT_SECRET=your_jwt_secret
BACKEND_PORT=4000
FRONTEND_URL=http://localhost:5173
```

Create a .env file in Frontend:

```env
VITE_API_URL=http://localhost:4000/api
```

Note:
- Socket client currently points to http://localhost:4000 in frontend service.

## Setup and Run

### 1) Install dependencies

Backend:
```bash
cd Backend
npm install
```

Frontend:
```bash
cd Frontend
npm install
```

### 2) Run database migrations

From Backend directory:
```bash
npx prisma migrate deploy
```

For local development migration creation:
```bash
npx prisma migrate dev
```

### 3) Start backend

From Backend directory:
```bash
npm run dev
```

### 4) Start frontend

From Frontend directory:
```bash
npm run dev
```

## Build for Production

Backend:
```bash
cd Backend
npm run build
npm start
```

Frontend:
```bash
cd Frontend
npm run build
npm run preview
```

## Current Notes

- Read status is currently saved in backend/database and not shown in UI.
- Presence uses in-memory map, so online state resets when backend restarts.
- Cookie auth requires frontend and backend CORS/credentials settings to match.

## Future Improvements

- Multi-device presence per user (map to multiple socket IDs)
- Persist online status and last seen updates
- Show read receipts in UI when needed
- Add message pagination for large conversations
