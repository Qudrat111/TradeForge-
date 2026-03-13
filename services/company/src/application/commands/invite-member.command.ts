export class InviteMemberCommand {
  constructor(
    public readonly companyId: string,
    public readonly tenantId: string,
    public readonly userId: string,
    public readonly role: string,
    public readonly invitedBy: string,
  ) {}
}
