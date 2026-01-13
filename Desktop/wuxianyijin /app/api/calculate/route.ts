import { NextRequest, NextResponse } from 'next/server';
import { calculateInsurance } from '@/lib/calculate';
import type { CalculateRequest } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body: CalculateRequest = await request.json();
    const { year, monthRange, city } = body;

    // Validate required fields
    if (!year || !city) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: year and city are required' },
        { status: 400 }
      );
    }

    // Perform calculation
    const results = await calculateInsurance({ year, monthRange, city });

    return NextResponse.json({
      success: true,
      message: `Calculation completed for ${results.length} employees`,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Calculation error: ${error.message}` },
      { status: 500 }
    );
  }
}
