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
import { CreateProfileDto, TaskAssigmentDto, UpdateProfileDto } from './dtos';
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

  async updateProfile({
    user,
    data,
    task,
  }: {
    user: IProfile['user'];
    data?: UpdateProfileDto;
    task?: TaskAssigmentDto;
  }): Promise<void> {
    const isValid = isValidObjectId(user);
    if (!isValid) throw new NotAcceptableException('id invalid!');
    const profileFound = await this.profileModel.getProfile(user);
    if (!profileFound) throw new NotFoundException('profile not found!');
    // ONLY TASKS ASSIGMENTS
    if (task) {
      const taskFound = await this.taskService.selectTask(task.task);
      if (!taskFound) throw new NotFoundException('task not found!');
      else {
        const assigned = profileFound.tasks.some(
          (item: any) => item === task.task,
        );
        if (assigned)
          throw new ConflictException('this task was already assigned');
        await this.profileModel.updateProfile(user, task);
      }
    }
    await this.profileModel.updateProfile(user, data);
  }
}
