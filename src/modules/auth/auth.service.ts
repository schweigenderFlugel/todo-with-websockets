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
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { SignInDto } from './dtos/signin.dto';
import config from '../../../config';
import { SignUpDto } from './dtos/signup.dto';
import { ITokenPayload } from '../../common/interfaces/auth.interface';
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

  async signup(data: SignUpDto): Promise<void> {
    data.password = await bcrypt.hash(data.password, 10);
    return await this.userService.createUser(data);
  }

  async signin(
    req: Request,
    data: SignInDto,
  ): Promise<{ accessToken: string; username: string } | undefined> {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userFound = await this.userService.getUserByEmail(data.email);
    if (!userFound) throw new NotFoundException('user not found!');
    const validate = await bcrypt.compare(data.password, userFound.password);
    if (!validate)
      throw new UnauthorizedException('the credential are invalid!');
    const payload: ITokenPayload = { id: userFound.id, role: userFound.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.nodeEnv === 'prod'
          ? this.configService.jwtAccessSecret
          : 'secret',
      expiresIn: '10m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.nodeEnv === 'prod'
          ? this.configService.jwtAccessSecret
          : 'secret',
      expiresIn: '1d',
    });
    const sessions = await this.authModel.getSessions(userFound.id);
    const sessionFound = sessions.some(
      (session) => session.userAgent === userAgent && session.ip === ip,
    );
    if (!sessionFound)
      await this.authModel.createSession(userFound.id, {
        refreshToken,
        userAgent,
        ip,
        lastEntry: new Date(),
      });
    else
      await this.authModel.updateSession(userFound.id, {
        refreshToken,
        lastEntry: new Date(),
      });

    return { accessToken: accessToken, username: userFound.username };
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

  async signout(req: Request, id: ObjectId): Promise<void> {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const sessions = await this.authModel.getSessions(id);
    const sessionFound = sessions.find(
      (session) => session.userAgent === userAgent && session.ip === ip,
    );
    await this.authModel.deleteSession(sessionFound.id);
  }
}
