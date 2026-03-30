"use client";

import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Moon, Sun, LogOut } from 'lucide-react';
import { AuthContext } from './AuthProvider';

const Navbar = ({ theme, toggleTheme }) => {
  const pathname = usePathname();
  const { user, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => pathname === path ? 'active' : '';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{ 
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'var(--background)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      backdropFilter: scrolled ? 'blur(16px)' : 'none'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px var(--primary-glow)' }}>
            <BookOpen size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>nextGenPrep</span>
        </Link>

        <div className="nav-links">
          {[
            { path: '/', label: 'Home' },
            { path: '/study-materials', label: 'Materials' },
            { path: '/mock-tests', label: 'Mock Tests' },
            { path: '/chatbot', label: 'AI Tutor' },
            { path: '/dashboard', label: 'Dashboard' },
          ].map(({ path, label }) => (
            <Link key={path} href={path} className={isActive(path)}>{label}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={toggleTheme} style={{ background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--fg-muted)' }}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', paddingLeft: '0.8rem', borderLeft: '1px solid var(--border)' }}>
              <span className="hidden sm:inline" style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
                Hi, <strong style={{ color: 'var(--foreground)' }}>{(user?.name || 'User').split(' ')[0]}</strong>
              </span>
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: 10, padding: '0.4rem 0.8rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                <LogOut size={13} /> Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem' }}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
