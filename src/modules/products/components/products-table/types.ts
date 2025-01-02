export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock_quantity: number;
  active: boolean;
  image_url: string | null;
  category: {
    name: string;
  } | null;
}

export interface ProductTableRowProps {
  row: Product;
}