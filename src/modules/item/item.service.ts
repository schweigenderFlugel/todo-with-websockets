import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ItemModel } from './item.model';
import { Item } from './item.schema';
import { CreateItemDto } from './item.dto';

@Injectable()
export class ItemService {
  constructor(@Inject(ItemModel) private readonly itemModel: ItemModel) {}

  async getAllItems(): Promise<Item[]> {
    return await this.itemModel.getAllItems();
  }

  async getItem(id: ObjectId): Promise<Item> {
    return await this.itemModel.getItem(id);
  }

  async createItem(data: CreateItemDto): Promise<void> {
    await this.itemModel.createItem(data);
  }

  async deleteItem(id: ObjectId): Promise<void> {
    await this.itemModel.deleteItem(id);
  }
}
