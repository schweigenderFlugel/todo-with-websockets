import { ObjectId } from 'mongoose';
import { User } from './user.schema';
import { Role } from 'src/common/enums/roles';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface IUserModel {
  getAllUsers(): Promise<User[]>;
  getUserById(id: ObjectId): Promise<User>;
  getUserByEmail(email: IUser['email']): Promise<User>;
  getUserByUsername(username: IUser['username']): Promise<User>;
  createUser(data: Omit<IUser, 'role'>): Promise<User>;
  updateUser(id: ObjectId, data: Partial<IUser>): Promise<void>;
}
