import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  bcryptRounds: number;
  rateLimitMax: number;
  rateLimitWindow: number;
}

export const authConfig = registerAs('auth', (): AuthConfig => ({
  bcryptRounds: parseInt(process.env['BCRYPT_ROUNDS'] ?? '12', 10),
  rateLimitMax: parseInt(process.env['RATE_LIMIT_MAX'] ?? '10', 10),
  rateLimitWindow: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] ?? '60000', 10),
}));
