import { User } from './user.schema';

export interface IUser {
  username: string;
  email: string;
  password: string;
}

export interface IUserModel {
  getUserByEmail(email: IUser['email']): Promise<User>;
  getUserByUsername(username: IUser['username']): Promise<User>;
  createUser(data: IUser): Promise<string>;
}
