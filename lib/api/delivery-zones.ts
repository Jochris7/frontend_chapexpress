import type { DeliveryZone } from '@/types';
import { apiClient } from './client';

export function getDeliveryZones(): Promise<DeliveryZone[]> {
  return apiClient<DeliveryZone[]>('/delivery-zones');
}
