import { NextRequest, NextResponse } from 'next/server';
import { getResults } from '@/lib/calculate';

export async function GET() {
  try {
    const results = await getResults();

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to fetch results: ${error.message}` },
      { status: 500 }
    );
  }
}
