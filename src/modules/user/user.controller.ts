import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles';
import { User } from './user.schema';
import { ObjectId } from 'mongoose';
import { UserDto } from './user.dto';
import { ObjectIdPipe } from 'src/common/pipes/object-id.pipe';

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
    @Param('id', ObjectIdPipe) id: ObjectId,
    @Body() data: UserDto,
  ): Promise<void> {
    return await this.userService.updateUser(id, data);
  }
}
