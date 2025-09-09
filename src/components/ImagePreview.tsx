import { Trash2 } from "lucide-react";
import Image from "next/image";

interface ImagePreviewProps {
  images: Array<{
    file: File;
    url: string;
    name: string;
  }>;
  onRemove: (index: number) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  onRemove,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative group border rounded-lg overflow-hidden bg-white shadow-sm"
        >
          <Image
            src={image.url}
            alt={image.name}
            className="w-full h-24 object-cover"
            height={500}
            width={500}
          />
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity duration-200">
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-1.5 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-600 p-2 truncate bg-slate-50">
            {image.name}
          </p>
        </div>
      ))}
    </div>
  );
};
