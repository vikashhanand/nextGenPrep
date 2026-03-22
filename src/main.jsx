import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

// ─── GOOGLE LOGIN CONFIGURATION ──────────────────────────────────────────────
// 1. Go to: https://console.cloud.google.com/
// 2. Create a project -> APIs & Services -> Credentials
// 3. Create OAuth Client ID (Web Application)
// 4. Authorized JavaScript Origin: http://localhost:5173
// 5. PASTE YOUR ID BELOW:
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

if (GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID_HERE")) {
  console.warn("⚠️ GOOGLE_CLIENT_ID is not configured. Google Sign-In will not work until you replace the placeholder in src/main.jsx with your real ID from Google Cloud Console.");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
