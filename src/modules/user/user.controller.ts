import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles';
import { User } from './user.schema';
import { ObjectId } from 'mongoose';
import { UserDto } from './user.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async asignAdminRole(
    @Param('id') id: ObjectId,
    @Body() data: UserDto,
  ): Promise<void> {
    return await this.userService.updateUser(id, data);
  }
}
