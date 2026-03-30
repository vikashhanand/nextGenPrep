import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req) {
  try {
    if (!GROQ_API_KEY) {
      console.error('Missing GROQ_API_KEY environment variable');
      return NextResponse.json(
        { reply: '⚠️ AI service is not configured. Please contact support.' },
        { status: 200 }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI tutor for students preparing for competitive exams like DSA, GATE, UPSC, SSC CGL, JEE, and NEET. Provide clear, concise, and accurate explanations. Use examples when helpful.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', response.status, errText);
      return NextResponse.json(
        { reply: '⚠️ AI service is temporarily unavailable. Please try again in a moment.' },
        { status: 200 }
      );
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response. Please try again.';
    return NextResponse.json({ reply });

  } catch (error) {
    console.error('AI route error:', error.message);
    return NextResponse.json(
      { reply: '⚠️ Unable to connect to AI service. Please check your connection and try again.' },
      { status: 200 }
    );
  }
}
