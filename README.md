# Firebase React Chat App

A real-time one-to-one chat application built with React and Firebase, featuring user authentication, active user listing, and message status indicators.

## Features

- User authentication (signup/login) using Firebase Auth
- Real-time list of active online users
- One-to-one chat functionality
- Message status indicators (sent, delivered, read)
- Real-time updates for messages and user status

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (version 12.x or later recommended)
- npm (usually comes with Node.js)
- A Firebase account and project set up

## Installation

1. Clone the repository:
   git clone https://github.com/your-username/firebase-react-chat-app.git
   cd firebase-react-chat-app
   Copy
2. Install the dependencies:
   npm install
   Copy
3. Create a `.env` file in the root directory and add your Firebase configuration:
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   Copy
   Replace the values with your actual Firebase project configuration.

## Usage

To run the app in development mode:
npm start
Copy
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Firebase Setup

1. Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Email/Password authentication in the Authentication section.
3. Set up Realtime Database and set the rules to allow read/write access:

   ```json
   {
     "rules": {
       ".read": "auth != null",
       ".write": "auth != null"
     }
   }
   Project Structure
   ```

src/App.js: Main component that handles auth state and renders Login or Chat component
src/components/Login.js: Handles user authentication (login and signup)
src/components/Chat.js: Main chat interface, handles messaging and user interactions
src/firebase.js: Firebase configuration and initialization
