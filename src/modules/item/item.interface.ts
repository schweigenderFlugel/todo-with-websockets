import { ObjectId } from 'mongoose';
import { Item } from './item.schema';

export interface IItem {
  title: string;
  description: string;
  requirements: string[];
}

export interface IItemModel {
  getAllItems(): Promise<Item[]>;
  getItem(id: ObjectId): Promise<Item>;
  createItem(data: IItem): Promise<void>;
  deleteItem(id: ObjectId): Promise<void>;
}
