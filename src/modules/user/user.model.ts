import { Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, IUserModel } from './user.interface';

@Injectable()
export class UserModel implements IUserModel {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async getAllUsers(): Promise<User[]> {
    return await this.model.find().select('email role');
  }

  async getUserById(id: ObjectId): Promise<User> {
    return await this.model.findOne({
      _id: id,
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.model.findOne({
      email: email,
    });
  }

  async getUserByUsername(username: string): Promise<User> {
    return await this.model.findOne({
      username: username,
    });
  }

  async createUser(user: Omit<IUser, 'role'>): Promise<void> {
    const newUser = new this.model(user);
    await newUser.save();
  }

  async updateUser(id: ObjectId, data: Partial<IUser>): Promise<void> {
    await this.model.findOneAndUpdate({ id, ...data });
  }
}
