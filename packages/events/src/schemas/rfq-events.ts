export const RFQ_EVENTS = {
  RFQ_PUBLISHED: 'rfq.published',
  RFQ_RESPONSE_SUBMITTED: 'rfq.response_submitted',
  RFQ_AWARDED: 'rfq.awarded',
  RFQ_CLOSED: 'rfq.closed',
  RFQ_CANCELLED: 'rfq.cancelled',
} as const;

export type RfqEventType = (typeof RFQ_EVENTS)[keyof typeof RFQ_EVENTS];

export interface RfqPublishedEvent {
  eventId: string;
  tenantId: string;
  rfqId: string;
  title: string;
  buyerId: string;
  currency: string;
  deadline: string;
  timestamp: string;
}

export interface RfqResponseSubmittedEvent {
  eventId: string;
  tenantId: string;
  rfqId: string;
  responseId: string;
  supplierTenantId: string;
  totalPrice: number;
  currency: string;
  leadTimeDays: number;
  timestamp: string;
}

export interface RfqAwardedEvent {
  eventId: string;
  tenantId: string;
  rfqId: string;
  awardedResponseId: string;
  awardedSupplierTenantId: string;
  awardedBy: string;
  timestamp: string;
}

export interface RfqClosedEvent {
  eventId: string;
  tenantId: string;
  rfqId: string;
  responseCount: number;
  timestamp: string;
}

export interface RfqCancelledEvent {
  eventId: string;
  tenantId: string;
  rfqId: string;
  cancelledBy: string;
  reason: string;
  timestamp: string;
}
