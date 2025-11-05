# SlotSwapper - Peer-to-Peer Time-Slot Scheduling

A full-stack MERN application for swapping time slots between users with real-time notifications.

**🌐 Live Demo**: https://slotswapper-client.netlify.app  
**🔗 Backend API**: https://slotswapper-bhee.onrender.com  
**📦 GitHub**: https://github.com/Sarwan-Projects/SlotSwapper

**✅ Status**: Fully deployed and working!  
**🔔 Features**: Real-time notifications, swap requests, user authentication

---

## 📋 Overview

SlotSwapper allows users to:
- Create and manage calendar events
- Mark events as "swappable"
- Browse and request swaps with other users
- Receive real-time notifications for swap requests
- Accept or reject swap requests

---

## 🛠️ Tech Stack

**Backend**: Node.js, Express.js, MongoDB, Socket.io, JWT  
**Frontend**: React, Socket.io-client, React Router, Axios  
**Testing**: Jest, Supertest (20+ test cases)  
**DevOps**: Docker, Render (Backend), Netlify (Frontend)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB Atlas account (configured)

### Installation

```bash
# Clone repository
git clone https://github.com/Sarwan-Projects/SlotSwapper.git
cd SlotSwapper

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..

# Run application
npm run dev
```

**Access**: http://localhost:3000

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Swaps
- `GET /api/swappable-slots` - Get available slots
- `POST /api/swap-request` - Request swap
- `GET /api/swap-requests/incoming` - Get incoming requests
- `GET /api/swap-requests/outgoing` - Get outgoing requests
- `POST /api/swap-response/:id` - Accept/reject swap

**Auth Header**: `Authorization: Bearer <token>`

---

## 🧪 Testing

```bash
# Run test suite
npm test

# Run with coverage
npm test -- --coverage

# Quick API test
node test-api.js
```

---

## 🎯 How It Works

1. **User A** creates "Team Meeting" and marks it SWAPPABLE
2. **User B** creates "Focus Block" and marks it SWAPPABLE
3. **User B** sees User A's slot in Marketplace
4. **User B** requests swap, offering their slot
5. Both slots locked as SWAP_PENDING
6. **User A** receives real-time notification 🔔
7. **User A** accepts → events swap owners automatically
8. **User B** receives acceptance notification 🔔

---

## 🗄️ Database Schema

**User**: `{ name, email, password (hashed) }`  
**Event**: `{ title, startTime, endTime, status, userId }`  
**SwapRequest**: `{ requesterId, requesterSlotId, targetUserId, targetSlotId, status }`

**Event Status**: `BUSY` → `SWAPPABLE` → `SWAP_PENDING` → `BUSY`

---

## 🚢 Deployment

### Backend (Render) - ✅ Deployed
**URL**: https://slotswapper-bhee.onrender.com

### Frontend (Netlify) - ✅ Deployed
**URL**: https://slotswapper-client.netlify.app

**Environment Variables (Already Configured)**:
- `REACT_APP_API_URL` = `https://slotswapper-bhee.onrender.com`
- `REACT_APP_SOCKET_URL` = `https://slotswapper-bhee.onrender.com`

---

## 📁 Project Structure

```
SlotSwapper/
├── server/
│   ├── models/          # User, Event, SwapRequest
│   ├── routes/          # auth, events, swaps
│   ├── middleware/      # JWT authentication
│   ├── tests/           # Jest test suite
│   └── index.js         # Server + Socket.io
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # SocketContext
│   │   └── App.js
│   └── package.json
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## ✨ Key Features

✅ **Real-time Notifications** - WebSocket with Socket.io  
✅ **Comprehensive Tests** - 20+ test cases with Jest  
✅ **Docker Support** - Containerized deployment  
✅ **Secure Auth** - JWT + bcrypt password hashing  
✅ **Loading States** - Prevents double-click submissions  
✅ **Cascade Delete** - Automatic cleanup on user deletion

---

## 🎯 Design Decisions

**JWT Authentication**: Stateless, scalable, no session storage  
**MongoDB Atlas**: Cloud database, no local setup required  
**Socket.io**: Real-time notifications with automatic fallback  
**SWAP_PENDING Status**: Prevents race conditions and double-booking  
**React Context**: Simple state management for WebSocket

---

## 📋 Assumptions

- Time zones handled by browser (local time)
- One-to-one swaps only
- No event overlap validation
- Swap is final once accepted
- User deletion is permanent with cascade delete

---

## 🚧 Challenges & Solutions

**Challenge**: Swap transaction atomicity  
**Solution**: SWAP_PENDING status locks slots during negotiation

**Challenge**: Double-click submissions  
**Solution**: Loading states disable buttons during processing

**Challenge**: Real-time updates  
**Solution**: Socket.io integration with React Context

**Challenge**: Orphaned data on user deletion  
**Solution**: Mongoose pre-delete middleware for cascade delete

---

## 🎁 Bonus Features Implemented

✅ Real-time Notifications (WebSocket)  
✅ Unit & Integration Tests  
✅ Deployment Configuration  
✅ Docker Containerization  
✅ Comprehensive Documentation

---

## 🌐 Live Application

**Frontend**: https://slotswapper-client.netlify.app  
**Backend API**: https://slotswapper-bhee.onrender.com  
**GitHub**: https://github.com/Sarwan-Projects/SlotSwapper

**Test the app**: Sign up, create events, mark as swappable, and test real-time swap notifications!

---

## 📄 License

MIT License

---

## 👤 Author

Created for ServiceHive Full Stack Intern Technical Challenge

---

**Built with MERN Stack + Socket.io + Jest + Docker**

**Deployed on Render (Backend) + Netlify (Frontend)**
