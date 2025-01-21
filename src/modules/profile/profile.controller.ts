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
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { JwtGuard } from 'src/common/guards';
import { UserRequest } from 'src/common/interfaces/auth.interface';
import { RouteSummary } from 'src/common/decorators';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @RouteSummary('Get the user profile')
  @Get()
  async getProfile(@Req() req: UserRequest) {
    const userId = req.user.id;
    return await this.profileService.getProfile(userId);
  }

  @RouteSummary('Create profile')
  @Post()
  async createProfile(@Req() req: UserRequest, @Body() data: CreateProfileDto) {
    const userId = req.user.id;
    return this.profileService.createProfile(userId, data);
  }

  @RouteSummary('Update profile')
  @Put()
  async updateProfile(@Req() req: UserRequest, @Body() data: UpdateProfileDto) {
    const user = req.user.id;
    return this.profileService.updateProfile(user, data);
  }
}
