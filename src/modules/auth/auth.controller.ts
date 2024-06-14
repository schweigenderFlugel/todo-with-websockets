import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { EventsGateway } from 'src/common/websocket/events.gateway';
import { UserRequest } from 'src/common/interfaces/auth.interface';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RefreshGuard } from 'src/common/guards/refresh.guard';

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
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() auth: SignInDto,
  ) {
    const { username, accessToken } = await this.authService.signin(
      req,
      res,
      auth,
    );
    this.eventsGateway.server.emit('signin', { username });
    return { accessToken };
  }

  @UseGuards(RefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() user: UserRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, username } = await this.authService.refresh(
      user,
      req,
      res,
    );
    this.eventsGateway.server.emit('signin', { username });
    return { accessToken };
  }

  @UseGuards(JwtGuard)
  @Put('change-password')
  async changePassword(
    @Req() req: UserRequest,
    @Body() data: ChangePasswordDto,
  ) {
    const id = req.user.id;
    return await this.authService.changePassword(id, data);
  }

  @UseGuards(JwtGuard)
  @Get('signout')
  async signout(
    @Req() req: Request,
    @Res() res: Response,
    @Req() user: UserRequest,
  ) {
    const id = user.user.id;
    return await this.authService.signout(req, res, id);
  }
}
