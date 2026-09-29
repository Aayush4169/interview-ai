# Smart AI Interview Prep

A web app for AI-powered interview preparation and quizzes.

## Features

- Generate interview plans from a job description and resume.
- Create and save AI-generated practice quizzes.
- Play two-player quizzes in real time.
- Generate a tailored resume PDF.

## Tech Stack

React, Node.js, Express, MongoDB, Gemini API, and Socket.IO.

## Run locally

1. Create `Backend/.env` with:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```

2. Start the backend:

   ```bash
   cd Backend
   npm install
   npm run dev
   ```

3. In another terminal, start the frontend:

   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

The frontend runs at `http://localhost:5173`; the backend runs at `http://localhost:3000`.
