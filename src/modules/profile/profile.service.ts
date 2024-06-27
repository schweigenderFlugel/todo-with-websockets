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
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
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
    data: CreateProfileDto,
  ): Promise<void> {
    const userFoundByEmail = await this.profileModel.getProfile(userId);
    if (userFoundByEmail)
      throw new ConflictException('the profile already exists');
    const { id: historialId } = await this.historialService.createHistorial();
    await this.profileModel.createProfile({
      userId,
      historial: historialId,
      ...data,
    });
  }

  async updateProfile(
    userId: IProfile['userId'],
    data: UpdateProfileDto,
  ): Promise<void> {
    const isValid = isValidObjectId(userId);
    if (!isValid) throw new NotAcceptableException('id invalid!');
    const profileFound = await this.profileModel.getProfile(userId);
    if (!profileFound) throw new NotFoundException('profile not found!');
    if (data.task) profileFound.tasks.push(data.task);
    return await this.profileModel.updateProfile(userId, data);
  }
}
