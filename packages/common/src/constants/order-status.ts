import { OrderStatus } from '../types/order.types';

/**
 * Defines the valid state transitions for an order.
 * An order may only move from a given status to one of the listed target statuses.
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.DRAFT]: [OrderStatus.PENDING_APPROVAL, OrderStatus.CANCELLED],
  [OrderStatus.PENDING_APPROVAL]: [
    OrderStatus.APPROVED,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.APPROVED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.DISPUTED],
  [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.DISPUTED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.DISPUTED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED, OrderStatus.COMPLETED],
};

/**
 * Returns true if transitioning an order from `from` to `to` is permitted.
 */
export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  const allowed = ORDER_STATUS_TRANSITIONS[from];
  return allowed.includes(to);
}
