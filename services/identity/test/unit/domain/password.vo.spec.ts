import { Password } from '../../../src/domain/value-objects/password.vo';

describe('Password Value Object', () => {
  describe('create', () => {
    it('should create a valid password', () => {
      expect(() => Password.create('SecurePass1!')).not.toThrow();
    });

    it('should throw if shorter than 8 characters', () => {
      expect(() => Password.create('Sh0rt!')).toThrow('at least 8 characters');
    });

    it('should throw if no uppercase letter', () => {
      expect(() => Password.create('securepass1!')).toThrow('uppercase');
    });

    it('should throw if no lowercase letter', () => {
      expect(() => Password.create('SECUREPASS1!')).toThrow('lowercase');
    });

    it('should throw if no number', () => {
      expect(() => Password.create('SecurePass!!')).toThrow('number');
    });

    it('should throw if no special character', () => {
      expect(() => Password.create('SecurePass123')).toThrow('special character');
    });

    it('should expose the raw value', () => {
      const raw = 'SecurePass1!';
      const p = Password.create(raw);
      expect(p.value).toBe(raw);
    });
  });

  describe('hash', () => {
    it('should produce a bcrypt hash', async () => {
      const p = Password.create('SecurePass1!');
      const hash = await p.hash(10);
      expect(hash).toMatch(/^\$2[aby]\$10\$/);
    });

    it('should produce different hashes for the same password', async () => {
      const p = Password.create('SecurePass1!');
      const [h1, h2] = await Promise.all([p.hash(10), p.hash(10)]);
      expect(h1).not.toBe(h2);
    });
  });

  describe('verify', () => {
    it('should return true when password matches hash', async () => {
      const raw = 'SecurePass1!';
      const p = Password.create(raw);
      const hash = await p.hash(10);
      const result = await Password.verify(raw, hash);
      expect(result).toBe(true);
    });

    it('should return false when password does not match', async () => {
      const p = Password.create('SecurePass1!');
      const hash = await p.hash(10);
      const result = await Password.verify('WrongPass1!', hash);
      expect(result).toBe(false);
    });
  });
});
