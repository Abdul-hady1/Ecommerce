export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  colors: string[];
  sizes?: string[];
  rating: number;
  reviewsCount: number;
  features?: string[];
}

export interface StoreConfig {
  id: string;
  name: string;
  tagline: string;
  themeColor: 'emerald' | 'sky' | 'amber' | 'rose' | 'indigo';
  fontFamily: 'sans' | 'serif' | 'mono';
  bannerText: string;
  bannerImage: string;
  products: Product[];
}

export interface CartItem {
  id: string; // unique item composition id: productId + color + size
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

export interface OrderLog {
  id: string;
  storeId: string;
  storeName: string;
  items: { productName: string; quantity: number; price: number; color: string; size?: string }[];
  total: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  status: 'confirmed' | 'packing' | 'intransit' | 'delivered';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  action?: {
    type: 'add_to_cart' | 'view_product' | 'apply_discount' | 'none';
    productId?: string;
    discountCode?: string;
  };
}
