export class CompanyName {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (trimmed.length < 2 || trimmed.length > 255) {
      throw new Error('Company name must be between 2 and 255 characters');
    }
    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  equals(other: CompanyName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
