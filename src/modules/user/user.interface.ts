export interface IUser {
  username: string;
  email: string;
  password: string;
}

export interface IUserModel {
  getUserByEmail(email: IUser['email']);
  getUserByUsername(username: IUser['username'];
  createUser(user: IUser): Promise<string>;
}
