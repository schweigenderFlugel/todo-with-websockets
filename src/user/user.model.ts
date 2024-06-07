import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, IUserModel } from './user.interface';

@Injectable()
export class UserModel implements IUserModel {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async getUserByEmail(email: string) {
    return this.model.findOne({
      email: email,
    });
  }

  async createUser(user: IUser): Promise<string> {
    const newUser = new this.model(user);
    newUser.save();
    return 'new user created';
  }
}
