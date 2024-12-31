import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyData } from "../types";

interface CompanyDetailsProps {
  company: CompanyData | null;
}

export function CompanyDetails({ company }: CompanyDetailsProps) {
  if (!company) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Razão Social</p>
            <p>{company.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nome Fantasia</p>
            <p>{company.trading_name || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
            <p>{company.tax_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Inscrição Estadual</p>
            <p>{company.state_tax_id || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Inscrição Municipal</p>
            <p>{company.municipal_tax_id || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Telefone</p>
            <p>{company.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{company.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Website</p>
            <p>{company.website || '-'}</p>
          </div>
        </div>

        {company.address && (
          <div className="mt-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">Endereço</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rua</p>
                <p>{company.address.street || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Número</p>
                <p>{company.address.number || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Complemento</p>
                <p>{company.address.complement || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bairro</p>
                <p>{company.address.neighborhood || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cidade</p>
                <p>{company.address.city || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <p>{company.address.state || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CEP</p>
                <p>{company.address.zip_code || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}