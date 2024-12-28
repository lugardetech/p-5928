export interface FormData {
  name: string;
  description: string;
  sku: string;
  price: string;
  cost_price: string;
  stock_quantity: string;
  min_stock_quantity: string;
  category_id: string;
  image: File | null;
}