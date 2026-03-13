import { Email } from '../../../src/domain/value-objects/email.vo';

describe('Email Value Object', () => {
  describe('constructor', () => {
    it('should create a valid email', () => {
      const email = new Email('User@Example.COM');
      expect(email.value).toBe('user@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = new Email('JOHN.DOE@COMPANY.ORG');
      expect(email.value).toBe('john.doe@company.org');
    });

    it('should trim whitespace', () => {
      const email = new Email('  user@example.com  ');
      expect(email.value).toBe('user@example.com');
    });

    it('should throw for email without @', () => {
      expect(() => new Email('notanemail')).toThrow('Invalid email');
    });

    it('should throw for email without domain', () => {
      expect(() => new Email('user@')).toThrow('Invalid email');
    });

    it('should throw for email without local part', () => {
      expect(() => new Email('@example.com')).toThrow('Invalid email');
    });

    it('should throw for empty string', () => {
      expect(() => new Email('')).toThrow('Invalid email');
    });

    it('should throw for email with spaces', () => {
      expect(() => new Email('user name@example.com')).toThrow('Invalid email');
    });
  });

  describe('equals', () => {
    it('should return true for emails with same value', () => {
      const a = new Email('user@example.com');
      const b = new Email('USER@EXAMPLE.COM');
      expect(a.equals(b)).toBe(true);
    });

    it('should return false for different emails', () => {
      const a = new Email('user1@example.com');
      const b = new Email('user2@example.com');
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the normalized email string', () => {
      const email = new Email('Admin@TradeForge.IO');
      expect(email.toString()).toBe('admin@tradeforge.io');
    });
  });
});
