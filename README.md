# React + Vite Student Management System

This project includes a student registration form that stores data in MongoDB.

## Features

- Student registration form with validation
- MongoDB database integration
- Express.js backend API
- React frontend with modern UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB

Create a `.env` file in the root directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/studentdb
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studentdb
```

### 3. Start MongoDB

Make sure MongoDB is running on your system. If using local MongoDB:
- Windows: MongoDB should be running as a service
- Mac/Linux: `mongod` or `brew services start mongodb-community`

### 4. Run the Application

You need to run both the backend server and frontend development server:

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:53367` (or the port shown in the terminal)
The backend API will be available at `http://localhost:3001`

## Project Structure

```
├── server.js                 # Express backend server
├── backend/
│   ├── models/
│   │   └── Student.js        # MongoDB Student model
│   └── routes/
│       └── studentRoutes.js  # API routes for students
├── src/
│   ├── components/
│   │   ├── StudentForm.jsx   # Student registration form component
│   │   └── StudentForm.css   # Form styles
│   └── App.jsx               # Main app component
```

## API Endpoints

- `POST /api/students` - Create a new student
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a single student by ID
- `GET /api/health` - Health check endpoint

## Form Fields

- **Name** (required)
- **Email** (required, must be unique)
- **Age** (required, 1-120)
- **Course** (required)
- **Grade** (required)
- **Phone** (optional)
- **Address** (optional)
