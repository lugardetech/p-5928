import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  nome: string;
  codigo: string;
  preco: string;
  unidade: string;
  estoque: string;
}

interface ProductsTableContentProps {
  products: Product[];
}

export const ProductsTableContent = ({ products }: ProductsTableContentProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium text-muted-foreground">Código</TableHead>
            <TableHead className="font-medium text-muted-foreground">Nome</TableHead>
            <TableHead className="font-medium text-muted-foreground">Preço</TableHead>
            <TableHead className="font-medium text-muted-foreground">Unidade</TableHead>
            <TableHead className="font-medium text-muted-foreground">Estoque</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow 
              key={product.id}
              className="h-12 hover:bg-muted/50"
            >
              <TableCell className="text-sm">{product.codigo}</TableCell>
              <TableCell className="text-sm">{product.nome}</TableCell>
              <TableCell className="text-sm">R$ {product.preco}</TableCell>
              <TableCell className="text-sm">{product.unidade}</TableCell>
              <TableCell className="text-sm">
                <Badge variant={parseInt(product.estoque) > 0 ? "default" : "destructive"}>
                  {product.estoque}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};