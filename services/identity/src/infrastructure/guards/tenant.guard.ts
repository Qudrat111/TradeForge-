import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenError, UnauthorizedError } from '@tradeforge/common';
import { JwtPayload } from '../../domain/services/auth.domain-service';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user: JwtPayload;
      params: Record<string, string>;
      query: Record<string, string>;
    }>();

    const user = request.user;
    if (user === undefined || user === null) {
      throw new UnauthorizedError('Authentication required');
    }

    const tenantId = request.params['tenantId'] ?? request.query['tenantId'];
    if (tenantId !== undefined && tenantId !== user.tenantId) {
      throw new ForbiddenError('Cross-tenant access is not permitted');
    }

    return true;
  }
}
