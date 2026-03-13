export const ORDER_EVENTS = {
  ORDER_CREATED: 'order.created',
  ORDER_APPROVED: 'order.approved',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_DELIVERED: 'order.delivered',
  ORDER_COMPLETED: 'order.completed',
  ORDER_CANCELLED: 'order.cancelled',
  PAYMENT_RECEIVED: 'order.payment_received',
} as const;

export type OrderEventType = (typeof ORDER_EVENTS)[keyof typeof ORDER_EVENTS];

export interface OrderCreatedEvent {
  eventId: string;
  tenantId: string;
  orderId: string;
  orderNumber: string;
  buyerTenantId: string;
  sellerTenantId: string;
  currency: string;
  total: number;
  timestamp: string;
}

export interface OrderApprovedEvent {
  eventId: string;
  tenantId: string;
  orderId: string;
  orderNumber: string;
  approvedBy: string;
  timestamp: string;
}

export interface OrderShippedEvent {
  eventId: string;
  tenantId: string;
  orderId: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  timestamp: string;
}

export interface OrderDeliveredEvent {
  eventId: string;
  tenantId: string;
  orderId: string;
  orderNumber: string;
  deliveredAt: string;
  timestamp: string;
}

export interface OrderCompletedEvent {
  eventId: string;
  tenantId: string;
  orderId: string;
  orderNumber: string;
  timestamp: string;
}

export interface OrderCancelledEvent {
  eventId: string;
  tenantId: string;
  orderId: string;
  orderNumber: string;
  cancelledBy: string;
  reason: string;
  timestamp: string;
}

export interface PaymentReceivedEvent {
  eventId: string;
  tenantId: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  paymentReference: string;
  timestamp: string;
}
