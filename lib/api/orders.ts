import type { DeliveryZone, Order, OrderStatus, PaymentMethod } from '@/types';
import { ApiError, apiFetch } from './client';
import { mapProduct, type BackendProduct } from './products';

interface BackendOrderItem {
  productId: string;
  product: BackendProduct;
  quantity: number;
  unitPrice: number;
  size: string | null;
}

interface BackendOrder {
  id: string;
  customerName: string;
  phone1: string;
  phone2: string | null;
  city: string;
  deliveryZoneId: string;
  deliveryZone: DeliveryZone;
  district: string | null;
  promoCode: string | null;
  items: BackendOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}

function mapOrder(order: BackendOrder): Order {
  return {
    id: order.id,
    customerName: order.customerName,
    phone1: order.phone1,
    phone2: order.phone2 ?? undefined,
    city: order.city,
    deliveryZoneId: order.deliveryZoneId,
    deliveryZone: order.deliveryZone,
    district: order.district ?? undefined,
    promoCode: order.promoCode ?? undefined,
    items: order.items.map((item) => ({
      productId: item.productId,
      product: mapProduct(item.product),
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      size: item.size ?? undefined,
    })),
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    paymentMethod: order.paymentMethod,
    status: order.status,
    createdAt: order.createdAt,
  };
}

export async function createOrder(
  orderData: Omit<Order, 'id' | 'createdAt' | 'status'>,
): Promise<Order> {
  const payload = {
    customerName: orderData.customerName,
    phone1: orderData.phone1,
    phone2: orderData.phone2,
    city: orderData.city,
    deliveryZoneId: orderData.deliveryZoneId,
    district: orderData.district,
    promoCode: orderData.promoCode,
    paymentMethod: orderData.paymentMethod,
    items: orderData.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size,
    })),
  };

  const order = await apiFetch<BackendOrder>('/orders', {
    method: 'POST',
    body: payload,
  });

  return mapOrder(order);
}

export async function getOrders(): Promise<Order[]> {
  const orders = await apiFetch<BackendOrder[]>('/orders', { auth: true });
  return orders.map(mapOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const order = await apiFetch<BackendOrder>(`/orders/${id}`, { auth: true });
    return mapOrder(order);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const order = await apiFetch<BackendOrder>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: { status },
    auth: true,
  });
  return mapOrder(order);
}
