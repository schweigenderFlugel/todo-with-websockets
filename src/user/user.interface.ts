export interface IUser {
  email: string;
  password: string;
}

export interface IUserModel {
  getUserByEmail(email: IUser['email']);
  createUser(user: IUser): Promise<string>;
}
