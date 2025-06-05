# AttenAi - React FrontendAdd commentMore actions

## Overview
AttenAi is a web-based attendance monitoring system that integrates face recognition technology for automated attendance tracking. This React frontend interacts with a Flask-based backend and Firebase for authentication and data storage.

## Features
- User authentication (Login/Signup)
- Module and schedule management
- Real-time face recognition for attendance
- Attendance logging and insights dashboard
- Live video feed for recognition
- Recent activity tracking

## Technologies Used
- **Frontend**: React, Firebase
- **Backend**: Flask (Python)
- **Database**: Firebase Firestore
- **State Management**: React Hooks
- **Styling**: CSS

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- Firebase project setup with Firestore

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/attenai.git
   cd attenai
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up Firebase:
   - Create a `.env` file and add Firebase credentials.
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```
4. Start the development server:
   ```sh
   npm start
   ```

## Project Structure
```
attenai/
│── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page-level components
│   ├── hooks/              # Custom React hooks
│   ├── firebaseConfig.js   # Firebase configuration
│   ├── App.js              # Main application file
│   ├── index.js            # Entry point
│── public/                 # Static assets
│── package.json            # Dependencies and scripts
│── .env                    # Environment variables
```

## Key Modules
- **Login & Authentication** (`Login.jsx`): Handles user authentication via Firebase.
- **Attendance Tracking** (`Attendance.jsx`): Fetches and displays attendance records.
- **Module Management** (`AddSchedules.jsx`, `Moduleinfo.jsx`): Allows adding and managing schedules.
- **Live Camera Feed** (`CameraFeed.jsx`): Streams video for real-time face recognition.
- **Dashboard** (`DashboardOverview.jsx`): Provides an overview of attendance insights.

## API Endpoints
This frontend interacts with a Flask backend, which exposes the following endpoints:
- `POST /register`: Register new users with face data.
- `POST /recognize`: Recognize users from the video feed.
- `GET /video/live`: Stream live video feed with face detection.

## Deployment
To deploy the frontend using Firebase Hosting:
```sh
npm run build
firebase deploy
```
Ensure Firebase CLI is configured for your project.

## Contribution
Feel free to fork this repository, make improvements, and submit a pull request!

## License
MIT License



You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
