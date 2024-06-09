import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserModel } from './user.model';
import { IUserModel } from './user.interface';

@Injectable()
export class UserService {
  constructor(@Inject(UserModel) readonly userModel: IUserModel) {}

  async getUserByEmail(email: string) {
    return await this.userModel.getUserByEmail(email);
  }

  async getUserByUsername(username: string) {
    return await this.userModel.getUserByUsername(username);
  }

  async createUser(user: UserDto): Promise<string> {
    user.password = await bcrypt.hash(user.password, 10);
    return this.userModel.createUser(user);
  }
}
