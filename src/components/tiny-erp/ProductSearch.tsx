import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProductSearch = ({ value, onChange }: ProductSearchProps) => {
  return (
    <div className="flex-1">
      <Input
        placeholder="Buscar por nome ou código..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};