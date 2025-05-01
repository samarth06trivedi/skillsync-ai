// app/api/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import users from '@/lib/db';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const existingUser = await users.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await users.insert({ name, email, password: hashedPassword });

  return NextResponse.json({ id: newUser._id, email: newUser.email });
}
