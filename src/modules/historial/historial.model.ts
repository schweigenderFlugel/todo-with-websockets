import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { IHistorial, IHistorialModel } from './historial.interface';
import { Historial } from './historial.schema';

@Injectable()
export class HistorialModel implements IHistorialModel {
  constructor(
    @InjectModel(Historial.name) private readonly model: Model<Historial>,
  ) {}

  async getHistorial(id: ObjectId): Promise<Historial> {
    return await this.model.findById(id);
  }

  async createHistorial(data: IHistorial): Promise<Historial> {
    const newHistorial = await this.model.create(data);
    return newHistorial.save();
  }

  async updateHistorial(
    userId: ObjectId,
    data: Partial<IHistorial>,
  ): Promise<void> {
    await this.model.findOneAndUpdate(userId, data);
  }
}
