export class LoginCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly tenantId: string,
    public readonly ipAddress: string,
  ) {}
}
