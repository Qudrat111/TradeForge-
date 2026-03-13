export enum RfqStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  AWARDED = 'awarded',
  CANCELLED = 'cancelled',
}

export enum RfqResponseStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export interface IRfqItem {
  productId: string;
  quantity: number;
  unit: string;
  specifications: Record<string, unknown>;
}

export interface IRfq {
  id: string;
  tenantId: string;
  buyerId: string;
  title: string;
  description: string;
  currency: string;
  deadline: Date;
  status: RfqStatus;
  items: IRfqItem[];
  createdAt: Date;
}

export interface IRfqResponse {
  id: string;
  rfqId: string;
  supplierTenantId: string;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  leadTimeDays: number;
  notes: string;
  status: RfqResponseStatus;
  createdAt: Date;
}
