import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() user: SignUpDto): Promise<string> {
    return this.userService.createUser(user);
  }

  @Post('signin')
  async login(@Body() auth: SignInDto): Promise<{ accessToken: string }> {
    return await this.authService.login(auth);
  }
}
