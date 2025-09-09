import { ExtractedData, ExtractionResult, fileHeaders } from "@/types/Image";
import { useEffect, useState } from "react";

export const useBusinessCardExtraction = () => {
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [data, setData] = useState<ExtractedData[] | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch("/api/extract");
        if (response.ok) {
          const details = await response.json();
          setData(details.cards || []);
        }
      } catch (error: unknown) {
        console.error("Initial data fetch error:", error);
      }
    };

    fetchInitialData();
  }, []);
  
  const extractFromImages = async (
    images: File[]
  ): Promise<ExtractedData[]> => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

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

      setProgress(100);
      setExtractedData(result.data);
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
      item.logo,
      item.url,
      item.email,
      item.phone,
      item.address,
      item.contactPerson,
      item.designation,
      item.confidence.toString(),
      item.rawText || "",
    ]);

    const csvContent = [fileHeaders, ...rows]
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "company datas.csv";
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
    progress,
  };
};
