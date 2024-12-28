import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "./types";

interface ProductStockProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function ProductStock({ formData, setFormData }: ProductStockProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
        <Input
          id="stock_quantity"
          type="number"
          value={formData.stock_quantity}
          onChange={(e) =>
            setFormData({
              ...formData,
              stock_quantity: e.target.value,
            })
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="min_stock_quantity">Estoque Mínimo</Label>
        <Input
          id="min_stock_quantity"
          type="number"
          value={formData.min_stock_quantity}
          onChange={(e) =>
            setFormData({
              ...formData,
              min_stock_quantity: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}