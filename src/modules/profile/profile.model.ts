import { Injectable } from '@nestjs/common';
import { Model, Schema } from 'mongoose';
import { Profile } from './profile.schema'; 
import { InjectModel } from '@nestjs/mongoose';
import { IProfile, IProfileModel } from './profile.interface';

@Injectable()
export class ProfileModel implements IProfileModel {
  constructor(@InjectModel(Profile.name) private readonly model: Model<Profile>) {}

  async getProfile(userId: Schema.Types.ObjectId): Promise<Profile> {
    return await this.model.findOne({ userId: userId })
      .populate({ path: 'userId', select: 'email' })
      .exec();
  }

  async createProfile(data: IProfile): Promise<void> {
    const newProfile = await this.model.create(data);
    newProfile.save();
  }

  async updateProfile(userId: Schema.Types.ObjectId, data: Partial<IProfile>): Promise<void> {
    await this.model.findOneAndUpdate(userId, data);
  }
}
