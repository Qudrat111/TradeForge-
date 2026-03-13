export class GetPermissionsQuery {
  constructor(
    public readonly userId: string,
    public readonly tenantId: string,
  ) {}
}
