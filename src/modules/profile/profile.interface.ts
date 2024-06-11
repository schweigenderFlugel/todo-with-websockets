import { ObjectId } from 'mongoose';
import { Profile } from './profile.schema';

export interface IProfile {
  userId: ObjectId;
  name: string;
  lastname: string;
  description: string;
}

export interface IProfileModel {
  getProfile(userId: IProfile['userId']): Promise<Profile>;
  createProfile(data: IProfile): Promise<void>;
  updateProfile(userId: ObjectId, data: Partial<IProfile>): Promise<void>;
}
