import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../lib/mongodb';
import Test from '../../../lib/models/Test';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    await connectToDatabase();
    
    const tests = await Test.find({ userId: decoded.id }).sort({ createdAt: -1 });
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 });
  }
}
