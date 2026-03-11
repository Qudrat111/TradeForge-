export class TaxId {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value.trim().toUpperCase();
    if (!/^[A-Z0-9]{5,20}$/.test(trimmed)) {
      throw new Error('Invalid tax ID format');
    }
    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  equals(other: TaxId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
