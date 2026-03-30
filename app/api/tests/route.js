import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../lib/mongodb';
import Test from '../../../lib/models/Test';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    await connectToDatabase();
    
    const { subject, score, total, accuracy, date } = await req.json();

    const test = new Test({
      userId: decoded.id,
      subject,
      score,
      total,
      accuracy,
      date
    });
    
    await test.save();

    return NextResponse.json(test);
  } catch (error) {
    console.error('Tests error:', error);
    return NextResponse.json({ error: 'Failed to save test' }, { status: 500 });
  }
}
