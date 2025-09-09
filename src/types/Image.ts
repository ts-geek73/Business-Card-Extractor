export interface ExtractedData {
  id: string;
  companyName?: string;
  url?: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  designation?: string;
  rawText?: string;
}

export interface ExtractionResult {
  success: boolean;
  data: ExtractedData[];
  processedCount: number;
  message: string;
}

export const fileHeaders = [
  "Company Name",
  "URL",
  "Email",
  "Phone",
  "Address",
  "Contact Person",
  "Designation",
];
