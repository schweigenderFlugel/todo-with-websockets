import { 
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Redirect,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import config from '../../config';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject(config.KEY) 
    private readonly configService: ConfigType<typeof config>,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<string>(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('X-WsApi-Key');
    const apiKey = this.configService.nodeEnv === 'prod'
      ? this.configService.apiKey
      : 'websockets';
    const isAuth = authHeader === apiKey;
    if (!isAuth) {
      Redirect('about');
      throw new UnauthorizedException('not allowed to access')
    }
    return true;
  }
}