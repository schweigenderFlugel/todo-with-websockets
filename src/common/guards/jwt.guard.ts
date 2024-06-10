import {
  Injectable,
  Inject,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import config from '../../../config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly jwtService: JwtService,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = this.jwtService.verifyAsync(token, {
        secret:
          this.configService.nodeEnv === 'prod'
            ? this.configService.jwtAccessSecret
            : 'secret',
      });
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
