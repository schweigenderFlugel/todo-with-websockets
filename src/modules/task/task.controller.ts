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

@UseGuards(JwtGuard, RolesGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return await this.taskService.getAllTasks();
  }

  @Get(':id')
  async selectTask(@Param('id', ObjectIdPipe) id: ObjectId): Promise<Task> {
    return await this.taskService.selectTask(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  async createTask(@Body() data: CreateTaskDto): Promise<void> {
    return await this.taskService.createTask(data);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async updateTask(
    @Param('id', ObjectIdPipe) id: ObjectId,
    @Body() data: UpdateTaskDto,
  ) {
    return await this.taskService.updateTask(id, data);
  }

  @Roles(Role.ADMIN)
  @Delete()
  async deleteTask(@Req() req: UserRequest): Promise<void> {
    const id = req.user.id;
    return await this.taskService.deleteTask(id);
  }
}
