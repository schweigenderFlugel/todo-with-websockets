import {
  Injectable,
  Inject,
  ExecutionContext,
  CanActivate,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import config from '../../../config';
import { ITokenPayload } from '../interfaces/auth.interface';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly jwtService: JwtService,
  ) {}

  private verifyRefreshToken(token: string): Promise<ITokenPayload> {
    const payload = this.jwtService.verifyAsync<ITokenPayload>(token, {
      secret:
        this.configService.nodeEnv === 'prod'
          ? this.configService.jwtRefreshSecret
          : 'refresh',
    });
    return payload;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const cookie = request.headers.cookie;
      if (!cookie) throw new NotFoundException('credentials not found!');
      const jwtCookie = cookie?.split('=')[1].split(';')[0];
      const payload = await this.verifyRefreshToken(jwtCookie);
      request['user'] = payload;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      } else if (error instanceof TokenExpiredError) {
        throw new ForbiddenException(error.message);
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
    return true;
  }
}
