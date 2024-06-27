import { ObjectId } from 'mongoose';
import { Profile } from './profile.schema';

export interface IProfile {
  userId: ObjectId;
  name: string;
  lastname: string;
  description: string;
  historial: ObjectId;
  tasks: ObjectId[];
}

export interface IProfileModel {
  getProfile(userId: IProfile['userId']): Promise<Profile>;
  createProfile(data: Omit<IProfile, 'tasks'>): Promise<Profile>;
  updateProfile(userId: ObjectId, data: Partial<IProfile>): Promise<void>;
}
