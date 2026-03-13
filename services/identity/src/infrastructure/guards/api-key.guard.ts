import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiKeyOrmEntity } from '../persistence/entities/api-key-orm.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(ApiKeyOrmEntity)
    private readonly apiKeyRepo: Repository<ApiKeyOrmEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();

    const rawHeader = request.headers['x-api-key'];
    const apiKey = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

    if (apiKey === undefined || apiKey.length === 0) {
      throw new UnauthorizedException('API key is required');
    }

    const candidates = await this.apiKeyRepo
      .createQueryBuilder('ak')
      .addSelect('ak.keyHash')
      .where('ak.isActive = :active', { active: true })
      .getMany();

    for (const candidate of candidates) {
      const matches = await bcrypt.compare(apiKey, candidate.keyHash);
      if (matches) {
        const now = new Date();
        if (candidate.expiresAt !== null && candidate.expiresAt < now) {
          throw new UnauthorizedException('API key has expired');
        }
        await this.apiKeyRepo.update(candidate.id, { lastUsedAt: now });
        return true;
      }
    }

    throw new UnauthorizedException('Invalid API key');
  }
}
