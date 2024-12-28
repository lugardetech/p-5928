import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "./types";

interface ProductPricingProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function ProductPricing({ formData, setFormData }: ProductPricingProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="price">Preço</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cost_price">Preço de Custo</Label>
        <Input
          id="cost_price"
          type="number"
          step="0.01"
          value={formData.cost_price}
          onChange={(e) =>
            setFormData({ ...formData, cost_price: e.target.value })
          }
        />
      </div>
    </div>
  );
}