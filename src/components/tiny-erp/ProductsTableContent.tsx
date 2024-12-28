import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Estoque</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.codigo}</TableCell>
              <TableCell>{product.nome}</TableCell>
              <TableCell>R$ {product.preco}</TableCell>
              <TableCell>{product.unidade}</TableCell>
              <TableCell>{product.estoque}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};