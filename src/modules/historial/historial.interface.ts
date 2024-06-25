import { ObjectId } from 'mongoose';
import { Historial } from './historial.schema';

export interface IHistorial {
  userId: ObjectId;
  made: number;
  succeded: number;
  failed: number;
}

export interface IHistorialModel {
  getHistorial(userId: ObjectId): Promise<Historial>;
  createHistorial(userId: ObjectId): Promise<void>;
  updateHistorial(
    userId: ObjectId,
    data: Partial<Omit<IHistorial, 'userId'>>,
  ): Promise<void>;
}
