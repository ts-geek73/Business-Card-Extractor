import { useBusinessCardExtraction } from "@/hooks";
import { CheckCircle } from "lucide-react";

export const CardDetailsList = () => {
  const { isLoading, data, ExportToCSV } = useBusinessCardExtraction();
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Extracted Data</span>
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

      {!!data && data.length > 0 && (
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded p-4 shadow-sm bg-slate-50"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <strong>Company Name:</strong> {item.companyName || "-"}
                </div>
                <div>
                  <strong>Website:</strong>{" "}
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.url}
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
                <div>
                  <strong>Email:</strong> {item.email || "-"}
                </div>
                <div>
                  <strong>Phone:</strong> {item.phone || "-"}
                </div>
                <div>
                  <strong>Address:</strong> {item.address || "-"}
                </div>
                <div>
                  <strong>Contact Person:</strong> {item.contactPerson || "-"}
                </div>
                <div>
                  <strong>Designation:</strong> {item.designation || "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
