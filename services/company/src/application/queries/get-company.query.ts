export class GetCompanyQuery {
  constructor(
    public readonly companyId: string,
    public readonly tenantId: string,
  ) {}
}
