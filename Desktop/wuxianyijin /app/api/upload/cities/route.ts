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
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Map column names (handle the typo: city_namte -> city_name)
    const mappedData = data.map((row: any) => ({
      city_name: row['city_namte '] || row['city_name'], // Handle typo with trailing space
      year: String(row['year']), // Convert year to string
      rate: row['rate'],
      base_min: row['base_min'],
      base_max: row['base_max'],
    }));

    // Check for existing data and handle overwrite logic
    const years = [...new Set(mappedData.map((d: any) => d.year))];

    for (const year of years) {
      // Delete existing data for this year
      const { error: deleteError } = await supabase
        .from(TABLES.CITIES)
        .delete()
        .eq('year', year);

      if (deleteError) {
        console.error(`Error deleting existing cities for year ${year}:`, deleteError);
      }
    }

    // Insert new data
    const { data: insertedData, error } = await supabase
      .from(TABLES.CITIES)
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
      message: `Successfully uploaded ${mappedData.length} city records`,
      data: insertedData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Error processing file: ${error.message}` },
      { status: 500 }
    );
  }
}
