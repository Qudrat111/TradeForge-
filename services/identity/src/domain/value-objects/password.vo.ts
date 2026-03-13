import * as bcrypt from 'bcrypt';

export class Password {
  private readonly _raw: string;

  private constructor(raw: string) {
    this._raw = raw;
  }

  static create(raw: string): Password {
    const minLength = 8;
    if (raw.length < minLength) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(raw)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(raw)) {
      throw new Error('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(raw)) {
      throw new Error('Password must contain at least one number');
    }
    if (!/[^A-Za-z0-9]/.test(raw)) {
      throw new Error('Password must contain at least one special character');
    }
    return new Password(raw);
  }

  async hash(rounds = 12): Promise<string> {
    return bcrypt.hash(this._raw, rounds);
  }

  static async verify(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }

  get value(): string {
    return this._raw;
  }
}
