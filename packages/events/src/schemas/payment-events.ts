export const PAYMENT_EVENTS = {
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
  INVOICE_ISSUED: 'payment.invoice_issued',
  INVOICE_PAID: 'payment.invoice_paid',
} as const;

export type PaymentEventType = (typeof PAYMENT_EVENTS)[keyof typeof PAYMENT_EVENTS];

export interface PaymentInitiatedEvent {
  eventId: string;
  tenantId: string;
  paymentId: string;
  orderId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  timestamp: string;
}

export interface PaymentCompletedEvent {
  eventId: string;
  tenantId: string;
  paymentId: string;
  orderId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  transactionReference: string;
  timestamp: string;
}

export interface PaymentFailedEvent {
  eventId: string;
  tenantId: string;
  paymentId: string;
  orderId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  failureReason: string;
  timestamp: string;
}

export interface PaymentRefundedEvent {
  eventId: string;
  tenantId: string;
  paymentId: string;
  orderId: string;
  invoiceId: string;
  refundAmount: number;
  currency: string;
  refundReference: string;
  timestamp: string;
}

export interface InvoiceIssuedEvent {
  eventId: string;
  tenantId: string;
  invoiceId: string;
  invoiceNumber: string;
  orderId: string;
  amount: number;
  currency: string;
  dueDate: string;
  timestamp: string;
}

export interface InvoicePaidEvent {
  eventId: string;
  tenantId: string;
  invoiceId: string;
  invoiceNumber: string;
  orderId: string;
  amount: number;
  currency: string;
  paidAt: string;
  timestamp: string;
}
