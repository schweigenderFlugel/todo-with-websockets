import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './profile.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { UserRequest } from 'src/common/interfaces/auth.interface';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req: UserRequest) {
    const userId = req.user.id;
    return await this.profileService.getProfile(userId);
  }

  @Post()
  async createProfile(@Req() req: UserRequest, @Body() data: ProfileDto) {
    const userId = req.user.id;
    return this.profileService.createProfile(userId, data);
  }

  @Put()
  async updateProfile(@Req() req: UserRequest, @Body() data: ProfileDto) {
    const userId = req.user.id;
    return this.profileService.updateProfile(userId, data);
  }
}
