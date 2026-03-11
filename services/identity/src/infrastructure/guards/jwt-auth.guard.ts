import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  override handleRequest<TUser>(err: Error | null, user: TUser | false): TUser {
    if (err instanceof TokenExpiredError) {
      throw new UnauthorizedException('Access token has expired');
    }
    if (err instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid access token');
    }
    if (err !== null || user === false || user === undefined || user === null) {
      throw new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
