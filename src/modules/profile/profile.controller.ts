import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { UserRequest } from 'src/common/interfaces/auth.interface';
import { Role } from 'src/common/enums/roles';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ObjectIdPipe } from 'src/common/pipes/object-id.pipe';
import { ObjectId } from 'mongoose';

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
  async createProfile(@Req() req: UserRequest, @Body() data: CreateProfileDto) {
    const userId = req.user.id;
    return this.profileService.createProfile(userId, data);
  }

  @Put()
  async updateProfile(@Req() req: UserRequest, @Body() data: UpdateProfileDto) {
    const userId = req.user.id;
    return this.profileService.updateProfile(userId, data);
  }

  @Roles(Role.ADMIN)
  @Put('task-assigment/:id')
  async assignTasks(
    @Param('id', ObjectIdPipe) user: ObjectId,
    @Body() data: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(user, data);
  }
}
