import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "./types";

interface ProductImageProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function ProductImage({ formData, setFormData }: ProductImageProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="image">Imagem</Label>
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFormData({
            ...formData,
            image: e.target.files ? e.target.files[0] : null,
          })
        }
      />
    </div>
  );
}