import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { LogIn, UserPlus, Eye, EyeOff, Loader2, BookOpen, X } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [isLogin, setIsLogin]     = useState(true);
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const body     = isLogin ? { email, password } : { name, email, password };

    try {
      const res  = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        login(data.user, data.token);
        navigate('/dashboard');
      }
    } catch {
      setError('Cannot reach backend. Make sure the server is running on port 5001.');
    }
    setLoading(false);
  };

  // Official Real Google Login Flow Action
  const handleActualGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        // Fetch securely verified Google Profile from pure access_token
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        
        // Pass verified entity straight to NextGenPrep database
        const res = await fetch('http://localhost:5001/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verifiedGoogleUser: userInfo }),
        });
        
        const data = await res.json();
        if (res.ok) {
          login(data.user, data.token);
          navigate('/dashboard');
        } else {
          setError(data.error || 'Google Login Registration Failed');
        }
      } catch (err) {
        console.error(err);
        setError('Network error during Google auth.');
      }
      setLoading(false);
    },
    onError: () => setError('Google Login Popup was blocked or failed.'),
  });

  const switchMode = () => { setIsLogin(p => !p); setError(''); };

  return (
    <div style={{
      minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', position: 'relative',
    }}>
      {/* background glow */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 300,
        background: 'radial-gradient(ellipse, rgba(255,69,0,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="animate-slide-up" style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Card */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20,
          padding: '2.25rem', boxShadow: '0 24px 64px -12px rgba(0,0,0,0.5)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg,#ff4500,#ff8c00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '0.75rem', boxShadow: '0 8px 24px rgba(255,69,0,0.35)',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <BookOpen size={24} color="#fff" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
              {isLogin ? 'Sign in to track your progress' : 'Join NextGenPrep for free'}
            </p>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: 'flex', background: 'var(--secondary)',
            borderRadius: 99, padding: 4, marginBottom: '1.5rem',
          }}>
            {['Login', 'Sign Up'].map((t, i) => {
              const active = (i === 0) === isLogin;
              return (
                <button
                  key={t} onClick={() => setIsLogin(i === 0)}
                  style={{
                    flex: 1, padding: '0.5rem', borderRadius: 99, border: 'none',
                    background: active ? 'var(--primary)' : 'transparent',
                    color: active ? '#fff' : 'var(--muted-foreground)',
                    fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                    transition: 'all 0.25s ease', fontFamily: 'Outfit, sans-serif',
                    boxShadow: active ? '0 4px 12px rgba(255,69,0,0.35)' : 'none',
                  }}
                >{t}
                </button>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '0.75rem 1rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, fontSize: '0.85rem', color: '#f87171', fontWeight: 500,
              animation: 'slideUp 0.3s ease',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.4rem' }}>
                  Full Name
                </label>
                <input
                  type="text" value={name} placeholder="Vikash Anand"
                  onChange={e => setName(e.target.value)} required className="input-square"
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <input
                type="email" value={email} placeholder="you@example.com"
                onChange={e => setEmail(e.target.value)} required className="input-square"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  placeholder="••••••••" onChange={e => setPassword(e.target.value)} required
                  className="input-square" style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button" onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading} className="btn btn-primary"
              style={{
                height: '3rem', fontSize: '0.95rem', borderRadius: 12, marginTop: '0.25rem', width: '100%',
                opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading
                ? <><Loader2 size={17} className="animate-spin" /> Processing…</>
                : isLogin ? <><LogIn size={17} /> Sign In</> : <><UserPlus size={17} /> Create Account</>
              }
            </button>

            {/* OR Separator */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '0.75rem 0', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* REAL Google Button */}
            <button
              type="button"
              onClick={() => handleActualGoogleLogin()}
              disabled={loading}
              style={{
                height: '3rem', fontSize: '0.95rem', borderRadius: 12, width: '100%', background: 'transparent',
                border: '1px solid var(--border)', color: 'var(--foreground)',
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                fontFamily: 'Outfit, sans-serif', fontWeight: 600, transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                if(!loading) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }
              }}
              onMouseLeave={e => {
                if(!loading) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Footer switch */}
          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={switchMode}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
