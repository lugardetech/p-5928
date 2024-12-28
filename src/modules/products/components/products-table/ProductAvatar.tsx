import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Package } from "lucide-react";

interface ProductAvatarProps {
  imageUrl: string | null;
  productName: string;
}

export const ProductAvatar = ({ imageUrl, productName }: ProductAvatarProps) => {
  return (
    <Avatar className="h-12 w-12">
      <AvatarImage 
        src={imageUrl || ""} 
        alt={productName} 
        className="object-cover"
      />
      <AvatarFallback>
        <Package className="h-6 w-6" />
      </AvatarFallback>
    </Avatar>
  );
};