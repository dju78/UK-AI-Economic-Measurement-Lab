import { NextResponse } from 'next/server';
import { DATA_MANIFEST } from '../../../lib/data';

export async function GET() {
  return NextResponse.json(DATA_MANIFEST);
}
