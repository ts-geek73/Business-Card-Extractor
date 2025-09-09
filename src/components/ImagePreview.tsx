import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";

interface ImagePreviewProps {
  images: Array<{
    file: File;
    url: string;
    name: string;
  }>;
  onRemove: (index: number) => void;
  onPreview: (image: { url: string; name: string }) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  onRemove,
  onPreview,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <Image
            src={image.url}
            alt={image.name}
            className="w-full h-32 object-cover rounded-lg border shadow-sm"
            height={500}
            width={500}
          />
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
              <button
                type="button"
                onClick={() => onPreview({ url: image.url, name: image.name })}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
        </div>
      ))}
    </div>
  );
};
