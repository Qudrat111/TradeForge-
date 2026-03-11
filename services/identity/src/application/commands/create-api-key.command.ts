export class CreateApiKeyCommand {
  constructor(
    public readonly tenantId: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly permissions: string[],
    public readonly expiresAt: Date | null,
  ) {}
}
