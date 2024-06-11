import { Injectable, Inject, ConflictException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ProfileModel } from './profile.model'; 
import { IProfile, IProfileModel } from './profile.interface'; 
import { ProfileDto } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(@Inject(ProfileModel) readonly profileModel: IProfileModel) {}

  async getProfile(userId: IProfile['userId']) {
    const isValid = isValidObjectId(userId);
    if (!isValid) throw new NotAcceptableException('id invalid!');
    const profileFound = await this.profileModel.getProfile(userId);
    if (!profileFound) throw new NotFoundException('profile not found!');
    return profileFound;
  }

  async createProfile(userId: IProfile['userId'], data: ProfileDto): Promise<void> {
    const userFoundByEmail = await this.profileModel.getProfile(userId);
    if (userFoundByEmail)
      throw new ConflictException('the profile already exists');
    return this.profileModel.createProfile({ userId, ...data });
  }
}
