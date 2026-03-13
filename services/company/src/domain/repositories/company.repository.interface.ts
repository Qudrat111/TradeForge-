import { CompanyDomainEntity, CompanyStatus } from '../entities/company.entity';

export interface ICompanyFilters {
  industry?: string;
  countryCode?: string;
  status?: string;
  search?: string;
}

export interface ICompanyRepository {
  findById(id: string): Promise<CompanyDomainEntity | null>;
  findByTenantId(tenantId: string): Promise<CompanyDomainEntity | null>;
  findBySlug(slug: string): Promise<CompanyDomainEntity | null>;
  findAll(
    page: number,
    limit: number,
    filters?: ICompanyFilters,
  ): Promise<[CompanyDomainEntity[], number]>;
  save(company: CompanyDomainEntity): Promise<CompanyDomainEntity>;
  update(id: string, data: Partial<CompanyDomainEntity>): Promise<CompanyDomainEntity>;
  delete(id: string): Promise<void>;
  existsBySlug(slug: string): Promise<boolean>;
}

export const COMPANY_REPOSITORY = Symbol('ICompanyRepository');
