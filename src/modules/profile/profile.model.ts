import { Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Profile } from './profile.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IProfile, IProfileModel } from './profile.interface';
import { Task } from '../task/task.schema';
import { Item } from '../item/item.schema';

@Injectable()
export class ProfileModel implements IProfileModel {
  constructor(
    @InjectModel(Profile.name) private readonly model: Model<Profile>,
  ) {}

  async getProfile(user: ObjectId): Promise<Profile> {
    return await this.model
      .findOne({ user: user })
      .populate({ path: 'user', select: 'email username' })
      .populate({ path: 'historial', select: 'made succeded failed tasks' })
      .populate({
        path: 'tasks',
        model: Task.name,
        select: 'title description timeLimit limit',
        populate: {
          path: 'items',
          model: Item.name,
          select: 'title description requirements',
        },
      })
      .exec();
  }

  async createProfile(data: IProfile): Promise<Profile> {
    const newProfile = await this.model.create({ user: data.user, ...data });
    return newProfile.save();
  }

  async updateProfile(
    user: ObjectId,
    data: Partial<IProfile>,
    assignment: boolean,
  ): Promise<void> {
    await this.model.findOneAndUpdate(
      { user: user },
      data?.task
        ? assignment === true
          ? { $push: { tasks: data.task } }
          : { $pull: { tasks: data.task } }
        : { ...data },
    );
  }
}
