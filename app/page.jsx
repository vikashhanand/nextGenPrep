"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, BrainCircuit, LineChart, Play, Sparkles, Target } from 'lucide-react';

const FEATURES = [
  { emoji: '📚', color: '#3b82f6', title: 'Free Study Materials', desc: 'Curated notes, PYQs, video links & official docs for every exam — opens directly in your browser.', link: '/study-materials', cta: 'Browse Materials' },
  { emoji: '🧪', color: '#22c55e', title: 'Interactive Mock Tests', desc: 'Topic-wise tests for DSA, GATE, UPSC, SSC, OOPs with a live countdown timer and score tracking.', link: '/mock-tests', cta: 'Start a Test' },
  { emoji: '🤖', color: '#a855f7', title: 'AI Tutor Chatbot', desc: 'Ask code questions, get working solutions with syntax highlighting, or request exam roadmaps 24/7.', link: '/chatbot', cta: 'Ask AI Tutor' },
  { emoji: '📊', color: '#f97316', title: 'Performance Dashboard', desc: 'Track your scores, accuracy trends and progress across all subjects saved to your account.', link: '/dashboard', cta: 'View Dashboard' },
];

const EXAMS = [
  { emoji: '🧮', label: 'DSA / CP' },
  { emoji: '🌐', label: 'Web Dev' },
  { emoji: '🎓', label: 'GATE CS' },
  { emoji: '🏛️', label: 'UPSC' },
  { emoji: '📋', label: 'SSC CGL' },
  { emoji: '⚛️', label: 'JEE Mains' },
  { emoji: '🔬', label: 'NEET' },
  { emoji: '🏗️', label: 'OOPs' },
];

export default function Home() {
  return (
    <div className="animate-slide-up">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '5rem 1.5rem 4rem', position: 'relative' }}>
        {/* glow blob */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(255,69,0,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(255,69,0,0.1)', border: '1px solid rgba(255,69,0,0.25)',
          borderRadius: 99, padding: '0.35rem 1rem', fontSize: '0.82rem',
          fontWeight: 600, color: '#ff6b35', marginBottom: '1.75rem',
        }}>
          <Sparkles size={13} /> Free for all students · No registration required to browse
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          Master Your Exams with<br />
          <span style={{ background: 'linear-gradient(135deg,#ff4500,#ff8c00)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            AI-Powered Learning
          </span>
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--fg-muted)', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.7 }}>
          The ultimate free study companion for every aspirant — DSA, GATE, UPSC, SSC, JEE & NEET, all in one place.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/mock-tests" className="btn btn-primary" style={{ fontSize: '0.95rem', padding: '0.65rem 1.5rem', borderRadius: 99 }}>
            <Play fill="currentColor" size={15} /> Take a Free Test
          </Link>
          <Link href="/study-materials" className="btn btn-secondary" style={{ fontSize: '0.95rem', padding: '0.65rem 1.5rem', borderRadius: 99 }}>
            Browse Materials <ArrowRight size={15} />
          </Link>
        </div>

        {/* Exam pills */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2.5rem' }}>
          {EXAMS.map(e => (
            <span key={e.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 99, padding: '0.3rem 0.85rem', fontSize: '0.82rem',
              color: 'var(--fg-muted)', fontWeight: 500,
            }}>
              {e.emoji} {e.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── FEATURE CARDS (rune.codes grid style) ───────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Everything you need to succeed 🎯
          </h2>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.95rem' }}>
            Four powerful tools — all free, all in one platform.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '1.75rem',
                display: 'flex', flexDirection: 'column', gap: '1rem',
                transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = f.color + '44';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.5)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 13,
                background: f.color + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem',
              }}>
                {f.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.87rem', color: 'var(--fg-muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
              <Link href={f.link} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                color: f.color, fontSize: '0.85rem', fontWeight: 700,
                textDecoration: 'none', transition: 'gap 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.gap = '0.55rem'}
                onMouseLeave={e => e.currentTarget.style.gap = '0.3rem'}
              >
                {f.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,69,0,0.12), rgba(255,140,0,0.08))',
          border: '1px solid rgba(255,69,0,0.2)',
          borderRadius: 18,
          padding: '2.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 400, height: 200,
            background: 'radial-gradient(ellipse, rgba(255,69,0,0.15), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.6rem', position: 'relative' }}>
            Ready to start preparing? 🚀
          </h2>
          <p style={{ color: 'var(--fg-muted)', marginBottom: '1.5rem', position: 'relative', fontSize: '0.95rem' }}>
            Join thousands of students using NextGenPrep. Create a free account to track your scores.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.65rem 1.75rem', fontSize: '0.95rem' }}>
              Create Free Account
            </Link>
            <Link href="/chatbot" className="btn btn-secondary" style={{ padding: '0.65rem 1.75rem', fontSize: '0.95rem' }}>
              Ask AI Tutor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
