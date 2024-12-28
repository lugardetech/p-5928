import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/support-table/columns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function SupportPage() {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          customer:customers(*)
        `);

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Atendimento</h1>
        <p className="text-secondary-foreground">Gerencie os atendimentos aos clientes</p>
      </header>

      <Card className="p-6">
        <DataTable 
          columns={columns} 
          data={tickets || []} 
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}