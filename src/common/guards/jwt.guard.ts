import {
  Injectable,
  Inject,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import config from '../../config';
import { ITokenPayload } from '../interfaces/auth.interface';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly jwtService: JwtService,
  ) {}

  private extractTokenFromRequestHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private verifyJwt(token: string): Promise<ITokenPayload> {
    const payload = this.jwtService.verifyAsync<ITokenPayload>(token, {
      secret:
        this.configService.nodeEnv === 'prod'
          ? this.configService.jwtAccessSecret
          : 'secret',
    });
    return payload;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const token = this.extractTokenFromRequestHeader(request);
      const payload = await this.verifyJwt(token);
      request['user'] = payload;
      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      } else if (error instanceof TokenExpiredError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
