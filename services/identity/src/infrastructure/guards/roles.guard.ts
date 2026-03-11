import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenError } from '@tradeforge/common';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../../domain/services/auth.domain-service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles === undefined || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = request.user;

    if (user === undefined || user === null) {
      throw new ForbiddenError('No user context found');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenError(`Role '${user.role}' is not authorized for this operation`);
    }

    return true;
  }
}
