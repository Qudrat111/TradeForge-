export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  DISCONTINUED = 'discontinued',
}

export interface II18nText {
  en: string;
  [locale: string]: string;
}

export interface IProductPrice {
  currency: string;
  amount: number;
  minQuantity: number;
}

export interface IProduct {
  id: string;
  tenantId: string;
  sku: string;
  name: II18nText;
  description: II18nText;
  categoryId: string;
  prices: IProductPrice[];
  hsCode: string;
  moq: number;
  leadTimeDays: number;
  status: ProductStatus;
  metadata: Record<string, unknown>;
  createdAt: Date;
}
