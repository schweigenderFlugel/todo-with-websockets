import { ObjectId } from 'mongoose';
import { Auth } from './auth.schema';

export interface IAuth {
  refreshToken: string;
  userAgent: string;
  ip: string;
  lastEntry: Date;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface IAuthModel {
  getSessions(id: ObjectId): Promise<Auth[]>;
  createSession(id: ObjectId, data: IAuth): Promise<void>;
  updateSession(id: ObjectId, data: Partial<IAuth>): Promise<void>;
  deleteSession(id: ObjectId): Promise<void>;
}
