// Database types for Supabase

export interface City {
  id: number;
  city_name: string;
  year: string;
  base_min: number;
  base_max: number;
  rate: number;
}

export interface Salary {
  id: number;
  employee_id: string;
  employee_name: string;
  month: string;
  salary_amount: number;
}

export interface Result {
  id: number;
  employee_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
  calculation_year: string | null;
  calculation_month: string | null;
  city_name: string | null;
  created_at: string;
}

// Types for API requests/responses
export interface CalculateRequest {
  year: string;
  monthRange?: string;
  city: string;
}

export interface CalculateResult {
  employee_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: any;
}
