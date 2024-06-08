import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserModel } from './user.model';
import { IUserModel } from './user.interface';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@Inject(UserModel) readonly userModel: IUserModel) {}

  async getUserByEmail(email: UserDto['email']) {
    return await this.userModel.getUserByEmail(email);
  }

  async createUser(user: UserDto): Promise<string> {
    user.password = await bcrypt.hash(user.password, 10);
    return this.userModel.createUser(user);
  }
}