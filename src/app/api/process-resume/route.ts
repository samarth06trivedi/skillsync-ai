import { NextResponse } from 'next/server';
import { extractResumeData } from '@/lib/extractResumeData';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const result = await extractResumeData(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
}