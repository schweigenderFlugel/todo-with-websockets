import { ObjectId } from 'mongoose';
import { Profile } from './profile.schema';

export interface IProfile {
  user: ObjectId;
  name: string;
  lastname: string;
  description: string;
  historial: ObjectId;
}

export interface IProfileModel {
  getProfile(userId: IProfile['user']): Promise<Profile>;
  createProfile(data: IProfile): Promise<Profile>;
  updateProfile(userId: ObjectId, data: Partial<IProfile>): Promise<void>;
}
