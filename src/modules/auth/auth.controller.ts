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
import { SignInDto, SignUpDto, ChangePasswordDto } from './dtos';
import { UserRequest } from 'src/common/interfaces/auth.interface';
import { JwtGuard, RefreshGuard } from 'src/common/guards';
import { RouteSummary } from 'src/common/decorators';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RouteSummary('Register a new user')
  @Post('signup')
  async signup(@Body() user: SignUpDto): Promise<void> {
    return await this.authService.signup(user);
  }

  @RouteSummary('Login and get an access and refresh token')
  @Post('signin')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() auth: SignInDto,
  ): Promise<{ accessToken: string }> {
    const { accessToken } = await this.authService.signin(req, res, auth);
    return { accessToken };
  }

  @RouteSummary('Refresh and get a new access token')
  @UseGuards(RefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() user: UserRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken } = await this.authService.refresh(user, req, res);
    return { accessToken };
  }

  @RouteSummary('Change the current password for a new one')
  @UseGuards(JwtGuard)
  @Put('change-password')
  async changePassword(
    @Req() req: UserRequest,
    @Body() data: ChangePasswordDto,
  ) {
    const id = req.user.id;
    return await this.authService.changePassword(id, data);
  }

  @RouteSummary('Logout and erase the refresh token')
  @UseGuards(RefreshGuard)
  @Get('signout')
  async signout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Req() user: UserRequest,
  ) {
    const id = user.user.id;
    return await this.authService.signout(req, res, id);
  }
}
