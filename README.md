# WhatsApp Web Clone

## Overview
A full-stack WhatsApp Web Clone built with React, Node.js, MongoDB Atlas, and Socket.IO. The application supports real-time messaging, authentication, user presence tracking, read receipts, delivery receipts, profile management, and cloud deployment.

---

## Live Demo

### Frontend (Vercel)
https://whatsapp-clone-lovat.vercel.app

### Backend (Render)
https://whatsapp-clone-4i2b.onrender.com

---

## Technology Stack

### Frontend
- React 19.2.7
- Vite
- Tailwind CSS
- Socket.IO Client
- Axios
- React Router DOM

### Backend
- Node.js 24.15.0
- Express.js 5.2.1
- MongoDB Atlas
- Mongoose 9.6.3
- Socket.IO 4.8.3
- JWT Authentication
- bcryptjs

---

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Automatic Logout on Token Expiry

### Chat System
- One-to-One Messaging
- Real-Time Messaging with Socket.IO
- Conversation Management
- Last Message Preview
- Auto Scroll to Latest Message
- Message Pagination

### Message Status
- Sent Status
- Delivered Status
- Read Status

### User Features
- Online/Offline Presence Indicators
- User Profile Management
- Profile Picture Upload & Update
- Logout Functionality

### Additional Enhancements
- Conversation Auto Sorting
- Socket Reconnection Handling
- Mobile Responsive UI
- Cloud Deployment (Vercel + Render)

---

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=<BACKEND_API_URL>/api
VITE_SOCKET_URL=<BACKEND_URL>
```

### Backend (.env)

```env
PORT=5000
FRONTEND_ORIGIN=<FRONTEND_URL>
JWT_SECRET=<YOUR_SECRET>
MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>
```

---

## Installation

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Deployment

### Frontend
Deploy on Vercel.

### Backend
Deploy on Render.

### Database
MongoDB Atlas.

---

## Project Structure

### Frontend
- Components
- Pages
- Services
- Routing
- Socket Configuration

### Backend
- Controllers
- Routes
- Models
- Middleware
- Socket Layer
- Database Configuration

---

## Author

Kavitha M
Full stack developer
https://www.linkedin.com/in/kavitham-dev/
