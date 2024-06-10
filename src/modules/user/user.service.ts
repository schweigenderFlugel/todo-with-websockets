import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { UserModel } from './user.model';
import { IUser, IUserModel } from './user.interface';

@Injectable()
export class UserService {
  constructor(@Inject(UserModel) readonly userModel: IUserModel) {}

  async getUser(email: string) {
    return await this.userModel.getUserByEmail(email);
  }

  async createUser(data: IUser): Promise<string> {
    const userFoundByEmail = await this.userModel.getUserByEmail(data.email);
    if (userFoundByEmail)
      throw new ConflictException('the user already exists');
    const userFoundByUsername = await this.userModel.getUserByUsername(
      data.username,
    );
    if (userFoundByUsername)
      throw new ConflictException('the username must be unique');
    return this.userModel.createUser(data);
  }
}
