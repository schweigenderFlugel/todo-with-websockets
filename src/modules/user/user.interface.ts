import { ObjectId } from 'mongoose';
import { User } from './user.schema';

export interface IUser {
  username: string;
  email: string;
  password: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface IUserModel {
  getUserByEmail(email: IUser['email']): Promise<User>;
  getUserByUsername(username: IUser['username']): Promise<User>;
  createUser(data: IUser): Promise<void>;
  updateUser(id: ObjectId, data: Partial<IUser>): Promise<void>;
}
