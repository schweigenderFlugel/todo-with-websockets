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
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Task } from './task.schema';
import { ObjectIdPipe } from 'src/common/pipes/object-id.pipe';
import { UserRequest } from 'src/common/interfaces/auth.interface';
import { TaskDto } from './task.dto';

@UseGuards(JwtGuard)
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

  @Post()
  async createTask(
    @Req() req: UserRequest,
    @Body() data: TaskDto,
  ): Promise<void> {
    const id = req.user.id;
    return await this.taskService.createTask(id, data);
  }

  @Put(':id')
  async updateTask(
    @Param('id', ObjectIdPipe) id: ObjectId,
    @Body() data: Partial<TaskDto>,
  ) {
    return await this.taskService.updateTask(id, data);
  }

  @Delete()
  async deleteTask(@Req() req: UserRequest): Promise<void> {
    const id = req.user.id;
    return await this.taskService.deleteTask(id);
  }
}
