import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './auth.dto';
import config from '../../config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}

  async login(auth: AuthDto): Promise<{ accessToken: string }> {
    const userFound = await this.userService.getUserByEmail(auth.email);
    if (!userFound) throw new NotFoundException();
    const validate = await bcrypt.compare(auth.password, userFound.password);
    if (!validate) throw new UnauthorizedException();
    const payload = { id: userFound._id };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.jwtAccessSecret,
      expiresIn: '10m',
    });
    return { accessToken: accessToken };
  }
}
