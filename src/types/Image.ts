export interface ExtractedData {
  id: string;
  companyName: string;
  logo: string;
  url: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  designation: string;
  confidence: number;
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
  "Logo",
  "URL",
  "Email",
  "Phone",
  "Address",
  "Contact Person",
  "Designation",
  "Confidence",
  "Raw Text",
];
