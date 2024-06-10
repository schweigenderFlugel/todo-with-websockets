import {
  Injectable,
  Inject,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import config from '../../../config';
import { Socket } from 'socket.io';

@Injectable()
export class JwtGuardWithWs implements CanActivate {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly jwtService: JwtService,
  ) {}
  private extractTokenFromHeader(client: Socket): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractTokenFromHeader(client);
    if (!token) throw new UnauthorizedException('not allowed');
    try {
      const payload = this.jwtService.verifyAsync(token, {
        secret:
          this.configService.nodeEnv === 'prod'
            ? this.configService.jwtAccessSecret
            : 'secret',
      });
      client['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
