import express from 'express';
import cors    from 'cors';
import mongoose from 'mongoose';
import dotenv  from 'dotenv';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✓ NextGenPrep API is Live and Connected (Powered by Clerk)!');
});

// ─── MongoDB ─────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nextgenprep';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('✗ MongoDB:', err.message));

// Updated Test Schema for Clerk User IDs (Strings)
const Test = mongoose.model('Test', new mongoose.Schema({
  userId:   { type: String,  required: true }, // Clerk ID
  subject:  { type: String,  required: true },
  score:    { type: Number,  required: true },
  total:    { type: Number,  required: true },
  accuracy: { type: Number,  required: true },
  date:     { type: String,  required: true },
}, { timestamps: true }));

// ─── CLERK AUTH MIDDLEWARE ──────────────────────────────────────────────────
// Uses CLERK_SECRET_KEY from environment
const auth = ClerkExpressWithAuth();

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
app.get('/api/dashboard', auth, async (req, res) => {
  try {
    const userId = req.auth.userId; // Provided by ClerkExpressWithAuth
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const tests = await Test.find({ userId }).sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── SAVE TEST ────────────────────────────────────────────────────────────────
app.post('/api/tests', auth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { subject, score, total, accuracy, date } = req.body;
    const test = new Test({ userId, subject, score, total, accuracy, date });
    await test.save();
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── AI TUTOR (Protected) ─────────────────────────────────────────────────────
app.post('/api/chat', auth, async (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'No message' });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Missing GROQ_API_KEY configuration' });
  }
  
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!r.ok) throw new Error('Groq unreachable');
    const data = await r.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    // Fallback Offline Knowledge...
    res.json({ reply: "⚠️ AI is temporarily offline. I am still here to help with DSA and GATE questions!" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✓ NextGenPrep server on :${PORT} — SECURED BY CLERK`));
