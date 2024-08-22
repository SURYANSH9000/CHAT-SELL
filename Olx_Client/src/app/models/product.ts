import { Address } from "./address";

export interface Product {
  _id: string;
  sellerId: string; // Seller user details
  name: string;
  price: number;
  details: { [key: string]: string }; 
  description: string;
  category: string; 
  location: string;
  address: Address;
  images: string[];
  isSponsored: boolean; 
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
}
