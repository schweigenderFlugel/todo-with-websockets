import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/modules/user/user.service';
import { SignInDto } from './dtos/signin.dto';
import config from '../../../config';
import { ConfigType } from '@nestjs/config';
import { SignUpDto } from './dtos/signup.dto';
import { ITokenPayload } from '../../common/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}

  async signup(data: SignUpDto): Promise<void> {
    data.password = await bcrypt.hash(data.password, 10);
    return await this.userService.createUser(data);
  }

  async signin(
    data: SignInDto,
  ): Promise<{ accessToken: string; username: string } | undefined> {
    const userFound = await this.userService.getUser(data.email);
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
    return { accessToken: accessToken, username: userFound.username };
  }
}
