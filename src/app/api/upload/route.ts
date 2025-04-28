import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
  }

  // You will later parse this file (PDF/DOC parsing)
  console.log('Received file:', (file as File).name);

  return NextResponse.json({ message: 'File received successfully!' });
}
