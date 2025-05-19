
# StudySavvy - Smart Study Planner

StudySavvy is a smart study planner application that helps students organize their study time effectively. It generates a personalized timetable based on subjects, exam dates, and available hours per day.

## Features

- Add and manage subjects with chapters, difficulty levels, and exam dates
- Set available study hours for each day of the week
- Generate an optimized study plan based on subjects and available time
- View your study plan in a calendar format
- Track your study progress

## Project Structure

This project consists of:
- **Frontend**: React application built with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: Python Flask API for data processing and study plan generation

## Running Locally

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```
   python app.py
   ```

The backend will run on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will run on `http://localhost:8080`.

## Deployment

### Backend Deployment (Railway)

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add the Python environment
4. Configure the necessary environment variables
5. Deploy the application

### Frontend Deployment (Netlify)

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Set environment variables (including your backend URL):
   ```
   VITE_API_BASE_URL=https://your-railway-app-url.com/api
   ```

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - react-query for data fetching
  - date-fns for date manipulation

- **Backend**:
  - Python
  - Flask
  - Flask-CORS
  - JSON for data storage (can be upgraded to a database)

## Future Enhancements

- User authentication system
- Database integration for persistent storage
- More sophisticated study plan algorithm
- Mobile application
- Email reminders for study sessions
