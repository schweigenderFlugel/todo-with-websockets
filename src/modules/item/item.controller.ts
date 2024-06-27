import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { ObjectIdPipe } from 'src/common/pipes/object-id.pipe';
import { ObjectId } from 'mongoose';
import { CreateItemDto } from './item.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles';

@UseGuards(JwtGuard, RolesGuard)
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getAllItems() {
    return await this.itemService.getAllItems();
  }

  @Get(':id')
  async getItem(@Param('id', ObjectIdPipe) id: ObjectId) {
    return await this.itemService.getItem(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  async createItem(@Body() data: CreateItemDto) {
    await this.itemService.createItem(data);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteItem(@Param('id', ObjectIdPipe) id: ObjectId) {
    await this.itemService.deleteItem(id);
  }
}
