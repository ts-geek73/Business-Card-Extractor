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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center space-x-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 mb-2">{message}</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress}% complete</p>
        </div>
      </div>
    </div>
  );
};
