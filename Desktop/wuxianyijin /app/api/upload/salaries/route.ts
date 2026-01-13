import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';
import * as xlsx from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel file
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(worksheet);

    // Convert data types (month needs to be string, remove id field)
    const mappedData = rawData.map((row: any) => ({
      employee_id: String(row['employee_id']),
      employee_name: row['employee_name'],
      month: String(row['month']), // Convert month to string
      salary_amount: row['salary_amount'],
    }));

    // Extract years from month field (first 4 characters)
    const years = [...new Set(mappedData.map((d: any) => d.month.substring(0, 4)))];

    // Delete existing data for these years (overwrite logic)
    for (const year of years) {
      const { error: deleteError } = await supabase
        .from(TABLES.SALARIES)
        .delete()
        .like('month', `${year}%`);

      if (deleteError) {
        console.error(`Error deleting existing salaries for year ${year}:`, deleteError);
      }
    }

    // Insert new data
    const { data: insertedData, error } = await supabase
      .from(TABLES.SALARIES)
      .insert(mappedData)
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, message: `Failed to insert data: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${mappedData.length} salary records`,
      data: insertedData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Error processing file: ${error.message}` },
      { status: 500 }
    );
  }
}
