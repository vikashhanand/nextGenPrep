import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function Login() {
  return (
    <div style={{
      minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', position: 'relative',
    }}>
      {/* background glow */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(var(--primary-rgb), 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="animate-slide-up" style={{ position: 'relative', zIndex: 1 }}>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border border-border shadow-2xl rounded-3xl",
              headerTitle: "text-foreground font-black text-2xl",
              headerSubtitle: "text-muted-foreground font-medium",
              socialButtonsBlockButton: "bg-secondary hover:bg-secondary/80 border-border text-foreground font-bold",
              formButtonPrimary: "bg-primary hover:bg-primary-hover text-white font-bold py-3",
              footerActionLink: "text-primary hover:text-primary-hover font-bold",
              formFieldInput: "bg-secondary border-border text-foreground",
              formFieldLabel: "text-foreground font-bold"
            }
          }}
          routing="path"
          path="/login"
          signUpUrl="/login" // Use the same page or a separate one if you create it
          afterSignInUrl="/dashboard"
        />
      </div>
    </div>
  );
}
