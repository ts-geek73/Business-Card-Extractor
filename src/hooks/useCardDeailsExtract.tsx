"use client";
import { ExtractedData, ExtractionResult, fileHeaders } from "@/types/Image";
import axios from "axios";
import { useEffect, useState } from "react";

export const useBusinessCardExtraction = () => {
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExtractedData[] | null>(null);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/extract", {
        params: {
          _time: `${new Date().getTime()}`,
        },
      });
      setData(response.data.cards);
    } catch (err) {
      console.error("Initial data fetch error:", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchInitialData();
  }, []);

  const extractFromImages = async (images: File[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post<ExtractionResult>(
        "/api/extract",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const result = response.data;

      if (!result.success) {
        setError(result.message || "Extraction failed");
        return;
      }

      setExtractedData(result.data);
      await fetchInitialData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
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
