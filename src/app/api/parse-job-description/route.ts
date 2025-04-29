// api/parse-job-description/route.ts
import { NextResponse } from 'next/server';
import { extractJobDetails } from '@/lib/extractJobDetails';

export async function POST(req: Request) {
  const { text } = await req.json();
  const parsed = await extractJobDetails(text);
  return NextResponse.json(parsed);
}
