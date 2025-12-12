# Firebase Setup Guide

This application uses Firebase for user authentication and data storage (Firestore). Follow these steps to set up your Firebase project and connect it to the application.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**.
3. Enter a project name (e.g., `study-app`) and follow the prompts to create the project.

## 2. Enable Authentication

1. In the Firebase Console sidebar, navigate to **Build** > **Authentication**.
2. Click **Get started**.
3. Select the **Sign-in method** tab.
4. Click on **Email/Password**.
5. Enable the **Email/Password** toggle and click **Save**.

## 3. Enable Firestore Database

1. In the Firebase Console sidebar, navigate to **Build** > **Firestore Database**.
2. Click **Create database**.
3. Choose a location for your database.
4. Select **Start in production mode** or **Start in test mode**.
   *   **Test mode** allows open access during development but is insecure for production.
   *   **Production mode** denies access by default. You will need to set up security rules.

### Firestore Security Rules

If you are starting in **Production mode**, go to the **Rules** tab in Firestore and add rules to allow authenticated users to read and write their own data.

Example rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
    match /assignments/{assignmentId} {
        allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
        allow create: if request.auth != null;
    }
  }
}
```

## 4. Get Project Configuration

1. In the Firebase Console, click the **Settings** (gear icon) > **Project settings**.
2. Scroll down to the **Your apps** section.
3. Click the web icon (`</>`) to create a new web app.
4. Register the app (you can ignore Firebase Hosting for now).
5. You will see a configuration object (`firebaseConfig`). You will need the values from this object for your environment variables.

## 5. Set Environment Variables

Create a `.env` file in the root of your project (or `.env.local` for local development) and add the following variables using the values from your Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 6. Run the Application

Now you can run the application with `npm run dev` and test the login/register functionality.
