import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { EventsGateway } from 'src/common/websocket/events.gateway';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Post('signup')
  async signup(@Body() user: SignUpDto): Promise<void> {
    return await this.authService.signup(user);
  }

  @Post('signin')
  async login(@Body() auth: SignInDto): Promise<{ accessToken: string }> {
    const { username, accessToken } = await this.authService.signin(auth);
    this.eventsGateway.server.emit('signin', { username });
    return { accessToken };
  }
}
