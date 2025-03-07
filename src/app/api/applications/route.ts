import { NextResponse } from 'next/server';

export async function POST() {
  // Dummy request for now!
  return NextResponse.json({ success: true, message: 'Application received' });
}
