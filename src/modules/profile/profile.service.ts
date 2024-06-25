import {
  Injectable,
  Inject,
  ConflictException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ProfileModel } from './profile.model';
import { IProfile, IProfileModel } from './profile.interface';
import { ProfileDto } from './profile.dto';
import { HistorialService } from '../historial/historial.service';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(ProfileModel) readonly profileModel: IProfileModel,
    private readonly historialService: HistorialService,
  ) {}

  async getProfile(userId: IProfile['userId']) {
    const isValid = isValidObjectId(userId);
    if (!isValid) throw new NotAcceptableException('id invalid!');
    const profileFound = await this.profileModel.getProfile(userId);
    if (!profileFound) throw new NotFoundException('profile not found!');
    return profileFound;
  }

  async createProfile(
    userId: IProfile['userId'],
    data: ProfileDto,
  ): Promise<void> {
    const userFoundByEmail = await this.profileModel.getProfile(userId);
    if (userFoundByEmail)
      throw new ConflictException('the profile already exists');
    await this.historialService.createHistorial(userId);
    return await this.profileModel.createProfile({ userId, ...data });
  }

  async updateProfile(
    userId: IProfile['userId'],
    data: Partial<ProfileDto>,
  ): Promise<void> {
    const isValid = isValidObjectId(userId);
    if (!isValid) throw new NotAcceptableException('id invalid!');
    const profileFound = await this.profileModel.getProfile(userId);
    if (!profileFound) throw new NotFoundException('profile not found!');
    return await this.profileModel.updateProfile(userId, data);
  }
}
