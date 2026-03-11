export class VerifyCompanyCommand {
  constructor(
    public readonly companyId: string,
    public readonly reviewerId: string,
    public readonly approved: boolean,
    public readonly rejectionReason?: string,
  ) {}
}
