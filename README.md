# PDR — BCA/MCA Student Study Platform V1

A web platform where BCA and MCA students can access semester-wise study material.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Quick Start

1. Start MongoDB (e.g. `docker run -d -p 27017:27017 mongo:7`).
2. In `server/`, copy `.env.example` to `.env` and set `MONGO_URI`.
3. Run `npm install` in both `server/` and `client/`.
4. Start the server: `cd server && npm start`
5. Start the client: `cd client && npm run dev`
6. Seed admin and sample data: `cd server && node seed.js`

## Roles

- **Student**: register, login, select course/semester, view subjects, notes, videos, PYQs, quizzes.
- **Admin**: login at `/admin`, manage courses, semesters, subjects, resources (notes/videos), PYQs, and quizzes.

## Default Accounts

- Admin: `admin@pdr.test` / `admin123`
- Student: `lovepreet@pdr.test` / `student123`
