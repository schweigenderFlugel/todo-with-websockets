import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { UserModel } from './user.model';
import { IUser, IUserModel } from './user.interface';
import { User } from './user.schema';
import { ObjectId } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@Inject(UserModel) private readonly userModel: IUserModel) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.getAllUsers();
  }

  async getUserById(id: ObjectId): Promise<User> | undefined {
    return await this.userModel.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User> | undefined {
    return await this.userModel.getUserByEmail(email);
  }

  async createUser(data: Omit<IUser, 'role'>): Promise<void> {
    const userFoundByEmail = await this.userModel.getUserByEmail(data.email);
    if (userFoundByEmail)
      throw new ConflictException('the user already exists');
    const userFoundByUsername = await this.userModel.getUserByUsername(
      data.username,
    );
    if (userFoundByUsername)
      throw new ConflictException('the username must be unique');
    await this.userModel.createUser(data);
  }

  async updateUser(id: ObjectId, data: Partial<IUser>) {
    return await this.userModel.updateUser(id, data);
  }
}
