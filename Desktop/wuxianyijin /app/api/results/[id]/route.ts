import { NextRequest, NextResponse } from 'next/server';
import { deleteResult } from '@/lib/calculate';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      );
    }

    await deleteResult(id);

    return NextResponse.json({
      success: true,
      message: 'Result deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to delete result: ${error.message}` },
      { status: 500 }
    );
  }
}
