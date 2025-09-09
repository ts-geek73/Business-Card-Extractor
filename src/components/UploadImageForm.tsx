import { Loader2, Upload } from "lucide-react";
import { FormEvent } from "react";

export const UploadImageForm: React.FC<{
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isDisabled: boolean;
  isLoading: boolean;
}> = ({ handleFileChange, handleSubmit, isLoading, isDisabled }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 bg-slate-100 rounded-full">
            <Upload className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Choose files
              </span>
              <span className="text-sm text-slate-600"> or drag and drop</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/jpeg, image/png, "
              multiple
              onChange={(e) => handleFileChange(e)}
              className="hidden"
            />
          </div>
          <p className="text-xs text-slate-500">
            PNG, JPG, GIF up to 10MB each
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isLoading ? (
          <span className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </span>
        ) : (
          "Extract Data"
        )}
      </button>
    </form>
  );
};
