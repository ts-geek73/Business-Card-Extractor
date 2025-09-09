import { Loader2 } from "lucide-react";

interface ProgressIndicatorProps {
  progress: number;
  isLoading: boolean;
  message?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  isLoading,
  message = "Processing Images...",
}) => {
  if (!isLoading) return null;

  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <div className="flex items-center space-x-3">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700 mb-2">{message}</p>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">{progress}% complete</p>
        </div>
      </div>
    </div>
  );
};
