import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "./types";
import { useState } from "react";

interface ProductImageProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function ProductImage({ formData, setFormData }: ProductImageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      // Criar URL para preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  return (
    <div className="grid gap-4">
      <Label htmlFor="image">Imagem</Label>
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-[200px] rounded-md border border-border"
          />
        </div>
      )}
    </div>
  );
}