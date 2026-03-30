import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const Footer = () => (
  <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--card)', padding: '4rem 0 2rem' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BookOpen size={20} color="var(--primary)" />
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>nextGenPrep</span>
          </div>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', lineHeight: 1.6 }}>The ultimate free study companion for every aspirant. Master your exams with AI.</p>
        </div>
        <div>
          <h4 style={{ marginBottom: '1.2rem', fontSize: '1rem' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <Link href="/study-materials" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9rem' }}>Materials</Link>
            <Link href="/mock-tests" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9rem' }}>Mock Tests</Link>
            <Link href="/chatbot" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9rem' }}>AI Tutor</Link>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '1.2rem', fontSize: '1rem' }}>Social</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <a href="https://instagram.com/vikashhanand" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9rem' }}>Instagram (@vikashhanand)</a>
            <a href="https://linkedin.com/in/vikashhanand" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9rem' }}>LinkedIn (@vikashhanand)</a>
            <a href="https://x.com/vikashhanand" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9rem' }}>X (Twitter) (@vikashhanand)</a>
            <a href="https://github.com/vikashhanand" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9rem' }}>GitHub (@vikashhanand)</a>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
        © 2026 nextGenPrep. Developed with ❤️ by <strong style={{ color: 'var(--foreground)' }}>Vikash Anand</strong>.
      </div>
    </div>
  </footer>
);

export default Footer;
