import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { IItem, IItemModel } from './item.interface';
import { Item } from './item.schema';

@Injectable()
export class ItemModel implements IItemModel {
  constructor(@InjectModel(Item.name) private readonly model: Model<Item>) {}

  async getAllItems(): Promise<Item[]> {
    return await this.model.find().select('title').exec();
  }

  async getItem(id: ObjectId): Promise<Item> {
    return await this.model.findOne({ id: id });
  }

  async createItem(data: IItem): Promise<void> {
    const newItem = await this.model.create(data);
    newItem.save();
  }

  async deleteItem(id: ObjectId): Promise<void> {
    await this.model.findOneAndDelete({ id: id });
  }
}
