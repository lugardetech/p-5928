import { Card } from "@/components/ui/card";
import { useMercadoLivreClaims } from "@/hooks/mercadolivre/useMercadoLivreClaims";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClaimsPage() {
  const { data: claims, isLoading, error } = useMercadoLivreClaims();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="p-6 bg-red-50">
          <h2 className="text-lg font-semibold text-red-700">Erro ao carregar reclamações</h2>
          <p className="text-red-600">{error.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Reclamações</h1>
        <p className="text-secondary-foreground">Gerencie suas reclamações do Mercado Livre</p>
      </header>

      <div className="grid gap-6">
        {claims?.map((claim) => (
          <Card key={claim.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{claim.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(claim.date_created), "PPP 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                claim.status === "closed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {claim.status === "closed" ? "Fechada" : "Aberta"}
              </span>
            </div>

            <div className="space-y-2">
              <p><strong>Comprador:</strong> {claim.buyer.nickname}</p>
              <p><strong>Produto:</strong> {claim.item.title}</p>
              <p><strong>Motivo:</strong> {claim.reason}</p>
            </div>

            {claim.messages && claim.messages.length > 0 && (
              <div className="mt-4 space-y-4">
                <h4 className="font-semibold">Mensagens</h4>
                {claim.messages.map((message) => (
                  <div key={message.id} className="bg-muted p-3 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{message.from.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(message.date_created), "PPP 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p>{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}