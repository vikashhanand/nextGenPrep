import express from 'express';
import cors    from 'cors';
import bcrypt  from 'bcryptjs';
import jwt     from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv  from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── MongoDB ─────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nextgenprep';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('✗ MongoDB:', err.message));

const User = mongoose.model('User', new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true }));

const Test = mongoose.model('Test', new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject:  { type: String,  required: true },
  score:    { type: Number,  required: true },
  total:    { type: Number,  required: true },
  accuracy: { type: Number,  required: true },
  date:     { type: String,  required: true },
}, { timestamps: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'nextgenprep_secret_key_2025';

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try { req.user = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET); next(); }
  catch { res.status(400).json({ error: 'Invalid token' }); }
};

// ─── Register ─────────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await new User({ name, email, password: hash }).save();
    await new Test({ userId: user._id, subject: 'Welcome Test', score: 8, total: 10, accuracy: 80, date: new Date().toLocaleDateString() }).save();
    const token = jwt.sign({ id: user._id, name }, JWT_SECRET);
    res.json({ token, user: { id: user._id, name, email } });
  } catch (err) { res.status(500).json({ error: 'Registration failed' }); }
});

// ─── Login ────────────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ error: 'Login failed' }); }
});

// ─── Google Login ─────────────────────────────────────────────────────────────
app.post('/api/auth/google', async (req, res) => {
  try {
    const { verifiedGoogleUser } = req.body;
    if (!verifiedGoogleUser || !verifiedGoogleUser.email) return res.status(400).json({ error: 'Invalid Google profile' });

    let user = await User.findOne({ email: verifiedGoogleUser.email });
    
    // Auto-register if user doesn't exist
    if (!user) {
      const hash = await bcrypt.hash(verifiedGoogleUser.sub + '_google_pass', 10);
      user = await new User({ name: verifiedGoogleUser.name, email: verifiedGoogleUser.email, password: hash }).save();
      await new Test({ userId: user._id, subject: 'Welcome Test (Google)', score: 8, total: 10, accuracy: 80, date: new Date().toLocaleDateString() }).save();
    }
    
    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Google Login failed on server' });
  }
});

// ─── Dashboard ────────────────────────────────────────────────────────────────
app.get('/api/dashboard', auth, async (req, res) => {
  try {
    const tests = await Test.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tests.map(t => ({ id: t._id, subject: t.subject, score: t.score, total: t.total, accuracy: t.accuracy, date: t.date })));
  } catch (err) { res.status(500).json({ error: 'Failed to fetch tests' }); }
});

// ─── Save Test ────────────────────────────────────────────────────────────────
app.post('/api/tests', auth, async (req, res) => {
  try {
    const { subject, score, total, accuracy, date } = req.body;
    const t = await new Test({ userId: req.user.id, subject, score, total, accuracy, date }).save();
    res.json({ success: true, id: t._id });
  } catch (err) { res.status(500).json({ error: 'Failed to save score' }); }
});

// ─── CHAT — Real Free AI (Pollinations.ai, no API key) ───────────────────────
const SYSTEM_PROMPT = `You are an intelligent AI chatbot integrated into the nextGenPrep website.

====================================
MAIN FUNCTION
====================================
Your job is to provide correct, clear, and helpful answers for students.

You must help with:
Programming languages: C++, Java, Python, JavaScript
Computer Science subjects: Data Structures and Algorithms (DSA), DBMS, Operating Systems, Computer Networks, Cyber Security basics
Other help: Coding questions, Debugging errors, MCQ explanations, Interview preparation, Lab experiments explanation

====================================
PROGRAMMING LANGUAGE RULE
====================================
If user asks for code in a specific language:
ALWAYS give code in the SAME language.

Examples:
User asks C++ → give C++ code
User asks Java → give Java code
User asks Python → give Python code

Never change programming language unless user asks.

====================================
CODE FORMAT
====================================
Always show code in proper format using markdown.

Example:
\`\`\`cpp
#include <iostream>
using namespace std;

int main(){
    cout<<"Hello World";
    return 0;
}
\`\`\`

====================================
OWNER INFORMATION & CHATBOT RULE
====================================
If any user asks about:
contact, support, owner, developer, social media, email, phone number, about creator
Then SHOW EXACTLY this information in proper format (DO NOT modify links, do not create fake info):

You can contact the developer here:

Instagram:
https://instagram.com/vikashhanad

X:
https://x.com/vikashhanand

LinkedIn:
https://linkedin.com/in/vikashhanand

Email:
vikashhanand@gmail.com

Phone:
+91 7903221054`;

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'No message' });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured on server' });
  }

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:  'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: message },
        ],
        temperature: 0.5,
      }),
      signal: AbortSignal.timeout(6000), // Fast 6-second timeout
    });
    
    if (!r.ok) {
        const errText = await r.text();
        console.error('Groq API Error:', r.status, errText);
        throw new Error(`Groq ${r.status}`);
    }
    
    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (reply) return res.json({ reply });
    
    throw new Error('Empty response from Groq');
  } catch (err) {
    console.warn('Groq AI failed, falling back:', err.message);

    // ── Final fallback: smart keyword-based local answers ──
    const msg = message.toLowerCase();
    const isCpp = /c\+\+|cpp/.test(msg);
    const isJava = /java\b/.test(msg);
    const isPython = /python/.test(msg);
    let reply = '';

    if (/hello|hi|hey/.test(msg)) {
      reply = "Hey! 👋 I'm your AI Tutor. Ask me about DSA, GATE, UPSC, coding, or exam strategy!";
    } else if (/binary search/.test(msg)) {
      if (isCpp) {
        reply = `**Binary Search (C++)** — O(log n) time, O(1) space\n\n\`\`\`cpp\nint binarySearch(vector<int>& arr, int target) {\n    int left = 0, right = arr.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\`\`\`\n\n✅ Requirement: Array must be **sorted**.`;
      } else if (isPython) {
        reply = `**Binary Search (Python)** — O(log n) time, O(1) space\n\n\`\`\`python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\`\`\`\n\n✅ Requirement: Array must be **sorted**.`;
      } else if (isJava) {
        reply = `**Binary Search (Java)** — O(log n) time, O(1) space\n\n\`\`\`java\npublic int binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\`\`\`\n\n✅ Requirement: Array must be **sorted**.`;
      } else {
        reply = `**Binary Search (JavaScript)** — O(log n) time, O(1) space\n\n\`\`\`javascript\nfunction binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n\`\`\`\n\n✅ Requirement: Array must be **sorted**.`;
      }
    } else if (/starvation|scheduling/.test(msg)) {
      reply = `**Priority Scheduling** (Option C) causes starvation.\n\nWhy: Low-priority processes may wait indefinitely if high-priority processes keep arriving.\n\n• Round Robin — Fair, no starvation\n• FCFS — No starvation\n• Priority — ⚠️ **Causes starvation**`;
    } else if (/normalization|bcnf|2nf|3nf/.test(msg)) {
      reply = `**DBMS Normalization:**\n• **1NF** — Atomic values\n• **2NF** — 1NF + no partial dependency\n• **3NF** — 2NF + no transitive dependency\n• **BCNF** — Every determinant is a candidate key`;
    } else if (/upsc|ias/.test(msg)) {
      reply = `**UPSC CSE Strategy:**\n1. NCERT (6-12) — Foundation\n2. Laxmikanth (Polity), Spectrum (History)\n3. Daily current affairs — The Hindu / InsightsIAS`;
    } else if (/quick sort|quicksort/.test(msg)) {
      if (isCpp) {
        reply = `**QuickSort (C++)** — Avg O(n log n)\n\`\`\`cpp\nvoid quickSort(int arr[], int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}\n\`\`\``;
      } else {
        reply = `**QuickSort (JavaScript)** — Average O(n log n), Worst O(n²)\n\`\`\`javascript\nfunction quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = arr.slice(0, -1).filter(x => x <= pivot);\n  const right = arr.slice(0, -1).filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}\n\`\`\``;
      }
    } else {
      reply = `⚠️ Groq real-time AI is temporarily unreachable, using offline knowledge.\n\nYou can ask about:\n• DSA — "binary search in C++"\n• GATE — "OS scheduling"\n• UPSC — "Polity notes"`;
    }

    res.json({ reply });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✓ NextGenPrep server on :${PORT} — Dual AI + MongoDB`));
