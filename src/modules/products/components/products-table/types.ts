export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  active: boolean;
  image_url: string | null;
  category: {
    name: string;
  } | null;
  description?: string;
}

export interface ProductTableRowProps {
  row: any;
}