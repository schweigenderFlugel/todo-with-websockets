import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongoose';
import { CookieOptions, Request, Response } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { SignInDto } from './dtos/signin.dto';
import config from '../../../config';
import { SignUpDto } from './dtos/signup.dto';
import {
  ITokenPayload,
  UserRequest,
} from '../../common/interfaces/auth.interface';
import { ChangePassword } from '../user/user.interface';
import { AuthModel } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly authModel: AuthModel,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}

  private async signAccessToken(payload: ITokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret:
        this.configService.nodeEnv === 'prod'
          ? this.configService.jwtAccessSecret
          : 'secret',
      expiresIn: '2h',
    });
  }

  private async signRefreshToken(payload: ITokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret:
        this.configService.nodeEnv === 'prod'
          ? this.configService.jwtRefreshSecret
          : 'refresh',
      expiresIn: '10s',
    });
  }

  private async setSession(req: Request, id: ObjectId, refreshToken: string) {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const sessions = await this.authModel.getSessions(id);
    const sessionFound = sessions.some(
      (session) => session.userAgent === userAgent && session.ip === ip,
    );
    if (!sessionFound)
      await this.authModel.createSession(id, {
        refreshToken,
        userAgent,
        ip,
        lastEntry: new Date(),
      });
    else
      await this.authModel.updateSession(id, {
        refreshToken,
        lastEntry: new Date(),
      });
  }

  private async setCookie(res: Response, refreshToken: string): Promise<void> {
    const options: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    };
    const cookieName =
      this.configService.nodeEnv === 'prod'
        ? this.configService.cookieName
        : 'cookie';
    res.cookie(cookieName, refreshToken, options);
  }

  private async removeCookie(res: Response): Promise<void> {
    const options: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    };
    const cookieName =
      this.configService.nodeEnv === 'prod'
        ? this.configService.cookieName
        : 'cookie';
    res.clearCookie(cookieName, options);
  }

  async signup(data: SignUpDto): Promise<void> {
    data.password = await bcrypt.hash(data.password, 10);
    return await this.userService.createUser(data);
  }

  async signin(
    req: Request,
    res: Response,
    data: SignInDto,
  ): Promise<{ accessToken: string; username: string } | undefined> {
    const userFound = await this.userService.getUserByEmail(data.email);
    if (!userFound) throw new NotFoundException('user not found!');
    const validate = await bcrypt.compare(data.password, userFound.password);
    if (!validate)
      throw new UnauthorizedException('the credential are invalid!');
    const payload: ITokenPayload = { id: userFound.id, role: userFound.role };
    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken(payload);
    await this.setCookie(res, refreshToken);
    // await this.setSession(req, userFound.id, refreshToken);
    return { accessToken: accessToken, username: userFound.username };
  }

  async refresh(
    user: UserRequest,
    req: Request,
    res: Response,
  ): Promise<{ accessToken: string; username: string } | undefined> {
    try {
      const userFound = await this.userService.getUserById(user.user.id);
      await this.removeCookie(res);
      const payload: ITokenPayload = {
        id: userFound.id,
        role: userFound.role,
      };
      const accessToken = await this.signAccessToken(payload);
      const refreshToken = await this.signRefreshToken(payload);
      await this.setCookie(res, refreshToken);
      // await this.setSession(req, user.user.id, refreshToken);
      return { accessToken: accessToken, username: userFound.username };
    } catch (error) {
      await this.removeCookie(res);
    }
  }

  async changePassword(id: ObjectId, data: ChangePassword) {
    const userFound = await this.userService.getUserById(id);
    if (!userFound) throw new NotFoundException('user not found!');
    const validate = await bcrypt.compare(
      data.currentPassword,
      userFound.password,
    );
    if (!validate)
      throw new UnauthorizedException('the credential are invalid!');
    if (data.currentPassword === data.newPassword)
      throw new BadRequestException('the passwords are equal!');
    data.newPassword = await bcrypt.hash(data.newPassword, 10);
    await this.userService.updateUser(id, { password: data.newPassword });
  }

  async signout(req: Request, res: Response, id: ObjectId): Promise<void> {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const sessions = await this.authModel.getSessions(id);
    const sessionFound = sessions.find(
      (session) => session.userAgent === userAgent && session.ip === ip,
    );
    await this.removeCookie(res);
    await this.authModel.deleteSession(sessionFound.id);
  }
}
