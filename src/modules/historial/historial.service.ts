import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { IHistorial, IHistorialModel } from './historial.interface';
import { HistorialModel } from './historial.model';
import { Historial } from './historial.schema';

@Injectable()
export class HistorialService {
  constructor(
    @Inject(HistorialModel) private readonly historialModel: IHistorialModel,
  ) {}

  async getHistorial(id: ObjectId): Promise<Historial> {
    return await this.historialModel.getHistorial(id);
  }

  async createHistorial(): Promise<Historial> {
    const data: IHistorial = {
      made: [],
      succeded: [],
      failed: [],
    };
    return await this.historialModel.createHistorial(data);
  }

  async updateHistorial(
    userId: ObjectId,
    data: Partial<Omit<IHistorial, 'userId'>>,
  ) {
    const todoFound = await this.historialModel.getHistorial(userId);
    if (!todoFound) throw new NotFoundException('todo not found!');
    let payload: Partial<IHistorial>;
    let succeded: boolean;
    return await this.historialModel.updateHistorial(userId, payload);
  }
}
