"use client";
import { ExtractedData, ExtractionResult, fileHeaders } from "@/types/Image";
import { useEffect, useState } from "react";

export const useBusinessCardExtraction = () => {
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExtractedData[] | null>(null);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/extract");
      if (response.ok) {
        const details = await response.json();
        setData(details.cards || []);
      }
    } catch (error: unknown) {
      console.error("Initial data fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchInitialData();
  }, []);

  const extractFromImages = async (
    images: File[]
  ): Promise<ExtractedData[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result: ExtractionResult = await response.json();
        setError(
          `HTTP error! status: ${response.status}, Message:${result.message}`
        );
        return [];
      }

      const result: ExtractionResult = await response.json();

      if (!result.success) {
        setError(result.message || "Extraction failed");
      }

      setExtractedData(result.data);
      fetchInitialData();

      return result.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const ExportToCSV = async () => {
    if (!data) {
      return <p>No data in the DB</p>;
    }

    const rows = data.map((item) => [
      item.companyName,
      item.url,
      item.email,
      item.phone,
      item.address,
      item.contactPerson,
      item.designation,
    ]);

    const csvContent = [fileHeaders, ...rows]
      .map((row) =>
        row.map((cell) => `"${(cell || "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "company.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    extractedData,
    ExportToCSV,
    data,
    extractFromImages,
    isLoading,
    error,
  };
};
