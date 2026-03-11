export class CreateCompanyCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly website: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly industry: string,
    public readonly taxId: string,
    public readonly countryCode: string,
    public readonly address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      countryCode: string;
    },
    public readonly employeeCount?: number,
    public readonly annualRevenue?: number,
  ) {}
}
