export class EnableMfaCommand {
  constructor(
    public readonly userId: string,
    public readonly tenantId: string,
  ) {}
}
