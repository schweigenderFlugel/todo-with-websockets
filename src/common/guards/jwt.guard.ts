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
import { Socket } from 'socket.io';

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

  private extractTokenFromClientHeader(client: Socket): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];
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
    const contextType = context.getType();
    try {
      if (contextType === 'http') {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromRequestHeader(request);
        const payload = await this.verifyJwt(token);
        request['user'] = payload;
      } else if (contextType === 'ws') {
        const client = context.switchToWs().getClient<Socket>();
        const token = this.extractTokenFromClientHeader(client);
        const payload = await this.verifyJwt(token);
        const data = context.switchToWs().getData();
        data['user'] = payload;
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      } else if (error instanceof TokenExpiredError) {
        throw new ForbiddenException(error.message);
      }
    }
    return true;
  }
}
