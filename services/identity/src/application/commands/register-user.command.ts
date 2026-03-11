export class RegisterUserCommand {
  constructor(
    public readonly tenantId: string,
    public readonly email: string,
    public readonly password: string,
    public readonly fullName: string,
    public readonly role: string,
  ) {}
}
