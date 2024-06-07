import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth..service';
import { AuthDto } from './auth.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() user: AuthDto): Promise<string> {
    return this.userService.createUser(user);
  }

  @Post('login')
  async login(@Body() auth: AuthDto): Promise<{ accessToken: string }> {
    return await this.authService.login(auth);
  }
}
