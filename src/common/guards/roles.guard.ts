import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());

    if (!roles) return true;

    const contextType = context.getType();

    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      const isAuth = roles.some((role) => role === user.role);

      if (!isAuth) throw new UnauthorizedException('your role is wrong');

      return true;
    } 
    else if (contextType === 'ws') {
      const client = context.switchToWs().getClient();
      const user = client.getData().user;

      const isAuth = roles.some((role) => role === user.role)

      if (!isAuth) throw new UnauthorizedException('your role is wrong');

      return true;
    }
  }
}
