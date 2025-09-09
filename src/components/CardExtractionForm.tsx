"use client";

import { useBusinessCardExtraction } from "@/hooks";
import { useFormik } from "formik";
import Image from "next/image";
import { useState } from "react";
import { ImagePreview, ProgressIndicator } from ".";

export const BusinessCardExtractionForm: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<
    { file: File; url: string; name: string }[]
  >([]);
  const { extractFromImages, isLoading, error, progress, extractedData } =
    useBusinessCardExtraction();

  const formik = useFormik({
    initialValues: { images: [] as File[] },
    onSubmit: async () => {
      try {
        await extractFromImages(selectedImages);
      } catch (err) {
        console.error(err);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setSelectedImages(files);

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviewImages(previews);

    formik.setFieldValue("images", files);
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    const updatedFiles = [...selectedImages];
    updatedFiles.splice(index, 1);
    setSelectedImages(updatedFiles);
  };

  return (
    <div className="space-y-6 bg-gradient-to-bl from-blue-200 via-white to-blue-200 h-full w-full">
      <form onSubmit={formik.handleSubmit}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block mb-4"
        />
        <ImagePreview
          images={previewImages}
          onRemove={handleRemoveImage}
          onPreview={({ name }) => alert(`Preview: ${name}`)}
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Extract Data
        </button>
      </form>

      {isLoading && (
        <ProgressIndicator progress={progress} isLoading={isLoading} />
      )}

      {error && <p className="text-red-500">{error}</p>}

      {extractedData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">Extracted Data</h2>
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Logo</th>
                <th>Website</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {extractedData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.companyName}</td>
                  <td>
                    {item.logo && (
                      <Image
                        src={item.logo}
                        alt="Logo"
                        className="h-8"
                        height={10}
                        width={10}
                      />
                    )}
                  </td>
                  <td>{item.url}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
