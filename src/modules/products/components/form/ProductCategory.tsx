import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "./types";

interface ProductCategoryProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function ProductCategory({ formData, setFormData }: ProductCategoryProps) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Categoria</Label>
      <Select
        value={formData.category_id}
        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}