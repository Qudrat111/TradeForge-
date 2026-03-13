import { Injectable } from '@nestjs/common';
import { ICompanyRepository } from '../repositories/company.repository.interface';

@Injectable()
export class CompanyDomainService {
  async validateUniqueSlug(slug: string, repo: ICompanyRepository): Promise<void> {
    const exists = await repo.existsBySlug(slug);
    if (exists) {
      throw new Error(`Company with slug "${slug}" already exists`);
    }
  }

  generateCompanySlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  validateCompanyData(data: { name: string; email: string; countryCode: string }): void {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Company name is required and must be at least 2 characters');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid company email address');
    }
    if (!data.countryCode || data.countryCode.length !== 2) {
      throw new Error('Valid ISO 3166-1 alpha-2 country code is required');
    }
  }
}
