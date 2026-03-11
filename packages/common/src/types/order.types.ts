export enum OrderStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

export interface IOrder {
  id: string;
  tenantId: string;
  orderNumber: string;
  buyerTenantId: string;
  sellerTenantId: string;
  rfqId: string | null;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  incoterm: string;
  shippingAddress: IShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
}
