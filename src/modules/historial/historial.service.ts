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

  async createHistorial(userId: ObjectId): Promise<void> {
    return await this.historialModel.createHistorial(userId);
  }

  async updateHistorial(
    userId: ObjectId,
    data: Partial<Omit<IHistorial, 'userId'>>,
  ) {
    const todoFound = await this.historialModel.getHistorial(userId);
    if (!todoFound) throw new NotFoundException('todo not found!');
    let payload: Partial<IHistorial>;
    if (data.succeded) {
      payload = {
        made: todoFound.made + 1,
        succeded: todoFound.succeded + 1,
      };
    } else if (data.failed) {
      payload = {
        made: todoFound.made + 1,
        failed: todoFound.failed + 1,
      };
    }
    return await this.historialModel.updateHistorial(userId, payload);
  }
}
