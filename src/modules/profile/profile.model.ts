import { Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Profile } from './profile.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IProfile, IProfileModel } from './profile.interface';

@Injectable()
export class ProfileModel implements IProfileModel {
  constructor(
    @InjectModel(Profile.name) private readonly model: Model<Profile>,
  ) {}

  async getProfile(userId: ObjectId): Promise<Profile> {
    return await this.model
      .findOne({ user: userId })
      .populate({ path: 'user', select: 'email username' })
      .populate({ path: 'historial' })
      .populate({ path: 'tasks' })
      .exec();
  }

  async createProfile(data: IProfile): Promise<Profile> {
    const newProfile = await this.model.create({ user: data.user, ...data });
    return newProfile.save();
  }

  async updateProfile(user: ObjectId, data: Partial<IProfile>): Promise<void> {
    await this.model.findOneAndUpdate(user, data);
  }
}
