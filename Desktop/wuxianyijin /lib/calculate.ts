import { supabase, TABLES } from './supabase';
import type { City, Salary, CalculateRequest, CalculateResult } from '@/types/database';

/**
 * Core calculation function for social insurance and housing fund
 */
export async function calculateInsurance(params: CalculateRequest): Promise<CalculateResult[]> {
  const { year, monthRange, city } = params;

  // Step 1: Build query filter for salaries
  let salariesQuery = supabase
    .from(TABLES.SALARIES)
    .select('*');

  // Filter by year (month field starts with year)
  if (year) {
    salariesQuery = salariesQuery.like('month', `${year}%`);
  }

  // Filter by month range if provided (e.g., "01-06")
  if (monthRange) {
    const [startMonth, endMonth] = monthRange.split('-').map(m => m.padStart(2, '0'));
    const startMonthFull = `${year}${startMonth}`;
    const endMonthFull = `${year}${endMonth}`;
    salariesQuery = salariesQuery.gte('month', startMonthFull).lte('month', endMonthFull);
  }

  const { data: salariesData, error: salariesError } = await salariesQuery;

  if (salariesError) {
    throw new Error(`Failed to fetch salaries: ${salariesError.message}`);
  }

  if (!salariesData || salariesData.length === 0) {
    return [];
  }

  // Step 2: Group by employee and calculate average salary
  const employeeSalaries = new Map<string, number[]>();

  salariesData.forEach((salary: Salary) => {
    if (!employeeSalaries.has(salary.employee_name)) {
      employeeSalaries.set(salary.employee_name, []);
    }
    employeeSalaries.get(salary.employee_name)!.push(salary.salary_amount);
  });

  const employeeAverages: Array<{ name: string; avgSalary: number }> = [];

  employeeSalaries.forEach((salaries, name) => {
    const avgSalary = salaries.reduce((sum, s) => sum + s, 0) / salaries.length;
    employeeAverages.push({ name, avgSalary });
  });

  // Step 3: Get city standards
  const { data: cityData, error: cityError } = await supabase
    .from(TABLES.CITIES)
    .select('*')
    .eq('city_name', city)
    .eq('year', year)
    .single();

  if (cityError) {
    throw new Error(`Failed to fetch city standards: ${cityError.message}`);
  }

  if (!cityData) {
    throw new Error(`City standards not found for ${city} in ${year}`);
  }

  const { base_min, base_max, rate } = cityData;

  // Step 4 & 5: Calculate contribution base and company fee
  const results: CalculateResult[] = employeeAverages.map(({ name, avgSalary }) => {
    // Determine contribution base (clamp between min and max)
    let contributionBase: number;
    if (avgSalary < base_min) {
      contributionBase = base_min;
    } else if (avgSalary > base_max) {
      contributionBase = base_max;
    } else {
      contributionBase = avgSalary;
    }

    // Calculate company fee
    const companyFee = contributionBase * rate;

    return {
      employee_name: name,
      avg_salary: Math.round(avgSalary * 100) / 100, // Round to 2 decimal places
      contribution_base: Math.round(contributionBase * 100) / 100,
      company_fee: Math.round(companyFee * 100) / 100,
    };
  });

  // Step 6: Save results to database
  const resultsToInsert = results.map(r => ({
    employee_name: r.employee_name,
    avg_salary: r.avg_salary,
    contribution_base: r.contribution_base,
    company_fee: r.company_fee,
    calculation_year: year,
    calculation_month: monthRange || null,
    city_name: city,
  }));

  const { error: insertError } = await supabase
    .from(TABLES.RESULTS)
    .insert(resultsToInsert);

  if (insertError) {
    throw new Error(`Failed to save results: ${insertError.message}`);
  }

  return results;
}

/**
 * Get all calculation results from database
 */
export async function getResults() {
  const { data, error } = await supabase
    .from(TABLES.RESULTS)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch results: ${error.message}`);
  }

  return data || [];
}

/**
 * Delete a result by ID
 */
export async function deleteResult(id: number) {
  const { error } = await supabase
    .from(TABLES.RESULTS)
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete result: ${error.message}`);
  }

  return true;
}
