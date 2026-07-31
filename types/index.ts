export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  category: Category;
  price: number;
  quantity: number;
  size?: string;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  city: string;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  size?: string;
}

export type PaymentMethod = 'wave' | 'cash_on_delivery';

export type OrderStatus = 'pending' | 'paid' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  phone1: string;
  phone2?: string;
  city: string;
  deliveryZoneId: string;
  deliveryZone: DeliveryZone;
  district?: string;
  promoCode?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}
