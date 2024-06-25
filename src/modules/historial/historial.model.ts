import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { IHistorial, IHistorialModel } from './historial.interface';
import { Historial } from './historial.schema';

@Injectable()
export class HistorialModel implements IHistorialModel {
  constructor(
    @InjectModel(Model.name) private readonly model: Model<Historial>,
  ) {}

  async getHistorial(userId: ObjectId): Promise<Historial> {
    return await this.model.findOne({ userId: userId });
  }

  async createHistorial(userId: ObjectId): Promise<void> {
    const newTodo = await this.model.create({ userId });
    newTodo.save();
  }

  async updateHistorial(
    userId: ObjectId,
    data: Partial<Omit<IHistorial, 'userId'>>,
  ): Promise<void> {
    await this.model.findOneAndUpdate(userId, data);
  }
}
