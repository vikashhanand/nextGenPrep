import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';

// ─── CLERK CONFIGURATION ──────────────────────────────────────────────────
// 1. Go to: https://dashboard.clerk.com/
// 2. Create an account -> Create Application
// 3. Choose your Auth methods (Email, Google, etc.)
// 4. PASTE your Publishable Key BELOW:
const PUBLISHABLE_KEY = "pk_test_YOUR_CLERK_KEY_HERE";

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY.includes("_YOUR_CLERK_KEY_HERE")) {
  console.error("⚠️ CLERK_PUBLISHABLE_KEY is missing! Authentication will NOT work. Please add your key in src/main.jsx or as an environment variable.");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClerkProvider>
  </React.StrictMode>
);
