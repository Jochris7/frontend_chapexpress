import type { DeliveryZone } from '@/types';
import { apiFetch } from './client';

export function getDeliveryZones(): Promise<DeliveryZone[]> {
  return apiFetch<DeliveryZone[]>('/delivery-zones');
}

export function createDeliveryZone(data: {
  name: string;
  city: string;
  fee: number;
}): Promise<DeliveryZone> {
  return apiFetch<DeliveryZone>('/delivery-zones', {
    method: 'POST',
    body: data,
    auth: true,
  });
}

export function updateDeliveryZone(
  id: string,
  data: Partial<{ name: string; city: string; fee: number }>,
): Promise<DeliveryZone> {
  return apiFetch<DeliveryZone>(`/delivery-zones/${id}`, {
    method: 'PATCH',
    body: data,
    auth: true,
  });
}

export function deleteDeliveryZone(id: string): Promise<void> {
  return apiFetch<void>(`/delivery-zones/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}
