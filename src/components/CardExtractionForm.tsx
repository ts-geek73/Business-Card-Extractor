"use client";
import { useBusinessCardExtraction } from "@/hooks";
import { useFormik } from "formik";
import { AlertCircle, FileImage, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { CardDetailsList, ImagePreview, UploadImageForm } from ".";

export const BusinessCardExtractionForm: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<
    { file: File; url: string; name: string }[] | null
  >(null);
  const [showError, setShowError] = useState<boolean>(false);
  const { extractFromImages, isLoading, error, data, ExportToCSV } =
    useBusinessCardExtraction();

  const formik = useFormik({
    initialValues: { images: [] as File[] },
    onSubmit: async () => {
      try {
        await extractFromImages(selectedImages);
        setShowError(true);
        setPreviewImages(null);
      } catch (err) {
        console.error(err);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setSelectedImages(files);

    const previews = files
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }))
      .filter(
        (newFile) =>
          !previewImages?.some(
            (existing) =>
              existing.name === newFile.name && existing.url === newFile.url
          )
      );
    setPreviewImages((prev) => (prev ? [...prev, ...previews] : previews));
    formik.setFieldValue("images", files);
  };

  const handleRemoveImage = (index: number) => {
    if (!previewImages) return;
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    const updatedFiles = [...selectedImages];
    updatedFiles.splice(index, 1);
    setSelectedImages(updatedFiles);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formik.handleSubmit(e);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-slate-800">
          Business Card Data Extraction
        </h1>
        <p className="text-slate-600">
          Upload business card images to extract contact information
        </p>
      </div>

      {error && showError && (
        <div className="flex justify-between border border-red-200 bg-red-50 rounded-lg p-4 ">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <X
            className="w-5 h-5 text-red-600 flex-shrink-0 cursor-pointer"
            onClick={() => setShowError(false)}
          />
        </div>
      )}

      <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm min-w-3xl">
        <div className="space-y-4">
          {previewImages && previewImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FileImage className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-medium text-slate-700">
                  Selected Images ({previewImages.length})
                </h3>
              </div>
              <ImagePreview
                images={previewImages}
                onRemove={handleRemoveImage}
              />
            </div>
          )}

          <UploadImageForm
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            isDisabled={isLoading || selectedImages.length === 0}
          />
        </div>
      </div>

      <CardDetailsList
        isLoading={isLoading}
        ExportToCSV={ExportToCSV}
        data={data}
      />
    </div>
  );
};
