import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { TaskService } from './task.service';
import { JwtGuard, RolesGuard } from 'src/common/guards';
import { Task } from './task.schema';
import { ObjectIdPipe } from 'src/common/pipes/object-id.pipe';
import { UserRequest } from 'src/common/interfaces/auth.interface';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles';
import { RouteSummary } from 'src/common/decorators';

@UseGuards(JwtGuard, RolesGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @RouteSummary('Get all tasks')
  @Roles(Role.ADMIN)
  @Get()
  async getAllTasks(@Req() req: UserRequest): Promise<Task[]> {
    const creator = req.user.id;
    return await this.taskService.getAllTasks(creator);
  }

  @RouteSummary('Get task by id')
  @Roles(Role.ADMIN)
  @Get(':id')
  async selectTask(@Param('id', ObjectIdPipe) id: ObjectId): Promise<Task> {
    return await this.taskService.selectTask(id);
  }

  @RouteSummary('Create a task')
  @Roles(Role.ADMIN)
  @Post()
  async createTask(
    @Req() req: UserRequest,
    @Body() data: CreateTaskDto,
  ): Promise<void> {
    const creator = req.user.id;
    return await this.taskService.createTask(creator, data);
  }

  @RouteSummary('Update a task')
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateTask(
    @Param('id', ObjectIdPipe) id: ObjectId,
    @Body() data: UpdateTaskDto,
  ) {
    return await this.taskService.updateTask(id, data);
  }

  @RouteSummary('Delete a task')
  @Roles(Role.ADMIN)
  @Delete()
  async deleteTask(@Req() req: UserRequest): Promise<void> {
    const id = req.user.id;
    return await this.taskService.deleteTask(id);
  }
}
