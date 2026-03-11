import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
  expiresInSeconds: number;
}

export const jwtConfig = registerAs('jwt', (): JwtConfig => ({
  secret: process.env['JWT_SECRET'] ?? 'default-jwt-secret-change-in-production',
  expiresIn: process.env['JWT_EXPIRES_IN'] ?? '15m',
  refreshSecret: process.env['JWT_REFRESH_SECRET'] ?? 'default-refresh-secret-change-in-production',
  refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d',
  expiresInSeconds: parseInt(process.env['JWT_EXPIRES_IN_SECONDS'] ?? '900', 10),
}));
