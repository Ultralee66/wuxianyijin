import { NextRequest, NextResponse } from 'next/server';
import { deleteResult } from '@/lib/calculate';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

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
