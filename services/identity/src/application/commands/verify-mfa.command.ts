export class VerifyMfaCommand {
  constructor(
    public readonly userId: string,
    public readonly tenantId: string,
    public readonly token: string,
  ) {}
}
