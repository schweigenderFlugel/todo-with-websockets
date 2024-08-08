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
import { TaskService } from '../task/task.service';
import { Profile } from './profile.schema';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(ProfileModel) readonly profileModel: IProfileModel,
    private readonly historialService: HistorialService,
    private readonly taskService: TaskService,
  ) {}

  async getProfile(user: IProfile['user']): Promise<Profile> {
    const isValid = isValidObjectId(user);
    if (!isValid) throw new NotAcceptableException('id invalid!');
    const profileFound = await this.profileModel.getProfile(user);
    if (!profileFound) throw new NotFoundException('profile not found!');
    return profileFound;
  }

  async createProfile(
    user: IProfile['user'],
    data: CreateProfileDto,
  ): Promise<void> {
    const userFoundByEmail = await this.profileModel.getProfile(user);
    if (userFoundByEmail)
      throw new ConflictException('the profile already exists');
    const { id: historialId } = await this.historialService.createHistorial();
    await this.profileModel.createProfile({
      user,
      historial: historialId,
      ...data,
    });
  }

  async updateProfile(user: IProfile['user'], data?: UpdateProfileDto): Promise<void> {
    const isValid = isValidObjectId(user);
    if (!isValid) throw new NotAcceptableException('id invalid!');
    const profileFound = await this.profileModel.getProfile(user);
    if (!profileFound) throw new NotFoundException('profile not found!');
    await this.profileModel.updateProfile(user, data);
  }
}
