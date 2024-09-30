import {
  Injectable,
  ExecutionContext,
  CanActivate,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import config from 'src/config';
import { ITokenPayload } from '../interfaces/auth.interface';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly jwtService: JwtService,
  ) {}

  private extractTokenFromClientHeader(client: Socket): string | undefined {
    const { authentication } = client.handshake.headers;
    return authentication as string;
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
      const client = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromClientHeader(client);
      const payload = await this.verifyJwt(token);
      const data = context.switchToWs().getData();
      data['user'] = payload;
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
