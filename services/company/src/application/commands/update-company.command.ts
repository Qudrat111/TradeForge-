export class UpdateCompanyCommand {
  constructor(
    public readonly companyId: string,
    public readonly tenantId: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly website?: string,
    public readonly phone?: string,
    public readonly industry?: string,
    public readonly employeeCount?: number,
    public readonly annualRevenue?: number,
  ) {}
}
