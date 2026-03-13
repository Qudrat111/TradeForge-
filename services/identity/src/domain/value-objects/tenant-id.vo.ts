const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class TenantId {
  private readonly _value: string;

  constructor(value: string) {
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid tenant ID (must be a valid UUID): ${value}`);
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: TenantId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
