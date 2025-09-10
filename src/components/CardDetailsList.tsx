import { ExtractedData } from "@/types/Image";
import { CheckCircle } from "lucide-react";

export const CardDetailsList: React.FC<{
  data: ExtractedData[] | null;
  isLoading: boolean;
  ExportToCSV: () => void;
}> = ({ ExportToCSV, isLoading, data }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Extracted Data ({data?.length || 0})</span>
        </h2>

        <button
          type="button"
          disabled={isLoading || (!!data && data.length === 0)}
          onClick={ExportToCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
        >
          Export CSV
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
          <span className="ml-4 text-blue-600 font-medium">Loading...</span>
        </div>
      ) : !!data && data.length > 0 ? (
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded p-4 shadow-sm bg-slate-50"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <strong>Company Name:</strong> {item.companyName || "____"}
                </div>
                <div>
                  <strong>Website:</strong>{" "}
                  {item.url && item.url !== "not" ? (
                    <a
                      href={
                        item.url.startsWith("http://") ||
                        item.url.startsWith("https://")
                          ? item.url
                          : `https://${item.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.url}
                    </a>
                  ) : (
                    "____"
                  )}
                </div>
                <div>
                  <strong>Email:</strong>{" "}
                  {item.email && item.email !== "not" ? (
                    <a
                      href={`mailto:${item.email}`}
                      aria-label={`mailto:${item.email}`}
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.email}
                    </a>
                  ) : (
                    "____"
                  )}
                </div>
                <div>
                  <strong>Phone:</strong> {item.phone || "____"}
                </div>
                <div>
                  <strong>Address:</strong> {item.address || "____"}
                </div>
                <div>
                  <strong>Contact Person:</strong>{" "}
                  {item.contactPerson || "____"}
                </div>
                <div>
                  <strong>Designation:</strong> {item.designation || "____"}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          No data available.
        </div>
      )}
    </div>
  );
};
