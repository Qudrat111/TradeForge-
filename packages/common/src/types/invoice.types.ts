export enum InvoiceStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export interface IInvoice {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  orderId: string;
  amount: number;
  currency: string;
  dueDate: Date;
  status: InvoiceStatus;
  pdfUrl: string | null;
  createdAt: Date;
}
