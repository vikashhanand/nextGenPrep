import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BookOpen, Moon, Sun, ChevronRight } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { AuthContext } from './AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import StudyMaterials from './pages/StudyMaterials';
import MockTests from './pages/MockTests';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';

// ─── NAVBAR ─────────────────────────────────────────────────────────────────
const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext); // Still used for compatibility/logic
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{ 
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'var(--background)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      backdropFilter: scrolled ? 'blur(16px)' : 'none'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            <BookOpen size={18} color="#fff" />
          </div>
          <span style={{ fontBold: 800, fontSize: '1.2rem', tracking: '-0.02em', letterSpacing: '-0.02em' }}>nextGenPrep</span>
        </Link>

        {/* Nav Links */}
        <div className="nav-links">
          {[
            { path: '/', label: 'Home' },
            { path: '/study-materials', label: 'Materials' },
            { path: '/mock-tests', label: 'Mock Tests' },
            { path: '/chatbot', label: 'AI Tutor' },
            { path: '/dashboard', label: 'Dashboard' },
          ].map(({ path, label }) => (
            <Link key={path} to={path} className={isActive(path)}>{label}</Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--secondary)', border: '1px solid var(--border)',
              borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--fg-muted)', transition: 'all 0.2s',
            }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          
          <SignedIn>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', paddingLeft: '0.8rem', borderLeft: '1px solid var(--border)' }}>
               <UserButton afterSignOutUrl="/" 
                 appearance={{
                   elements: {
                     avatarBox: "w-8 h-8 rounded-lg",
                   }
                 }}
               />
             </div>
          </SignedIn>
          
          <SignedOut>
            <Link to="/login" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem' }}>
              Sign In
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

// ─── FOOTER ──────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{
    borderTop: '1px solid var(--border)',
    padding: '3rem 1rem 2rem',
    background: 'var(--card)',
    marginTop: '4rem',
    color: 'var(--muted-foreground)',
    fontSize: '0.9rem',
  }}>
    <div className="container" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: 'var(--foreground)' }}>
          Developed by Vikash Anand
        </p>
        <p style={{ margin: 0, fontSize: '0.85rem' }}>
          NextGenPrep — Free study resources & AI Tutor
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontWeight: 500 }}>
        <a href="https://instagram.com/vikashhanad" target="_blank" rel="noreferrer" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color 0.2s' }}>Instagram</a>
        <a href="https://x.com/vikashhanand" target="_blank" rel="noreferrer" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color 0.2s' }}>X (Twitter)</a>
        <a href="https://linkedin.com/in/vikashhanand" target="_blank" rel="noreferrer" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color 0.2s' }}>LinkedIn</a>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontSize: '0.85rem' }}>
        <a href="mailto:vikashhanand@gmail.com" style={{ color: 'var(--muted-foreground)', textDecoration: 'none' }}>vikashhanand@gmail.com</a>
        <span>+91 7903221054</span>
      </div>

      <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6, marginTop: '1rem' }}>
        © {new Date().getFullYear()} NextGenPrep. All rights reserved.
      </p>
    </div>
  </footer>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('ngp-theme') || 'dark');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = theme === 'dark' ? '#020617' : '#f8fafc';
    localStorage.setItem('ngp-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const isChatPage = location.pathname === '/chatbot';

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="page-wrapper" style={{ flex: 1, padding: 0 }}>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/dashboard"       element={<Dashboard />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/mock-tests"      element={<MockTests />} />
          <Route path="/chatbot"         element={<Chatbot />} />
          <Route path="/login"           element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
