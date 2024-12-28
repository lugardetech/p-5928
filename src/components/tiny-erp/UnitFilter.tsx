import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UnitFilterProps {
  units: string[];
  selectedUnit: string;
  onUnitChange: (unit: string) => void;
}

export const UnitFilter = ({ units, selectedUnit, onUnitChange }: UnitFilterProps) => {
  return (
    <div className="w-[180px]">
      <Select value={selectedUnit} onValueChange={onUnitChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por unidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as unidades</SelectItem>
          {units.map((unit: string) => (
            <SelectItem key={unit} value={unit}>
              {unit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};