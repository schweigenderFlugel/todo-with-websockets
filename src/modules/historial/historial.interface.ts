import { ObjectId } from 'mongoose';
import { Historial } from './historial.schema';

export interface IHistorial {
  made: number;
  succeded: number;
  failed: number;
  tasks: ObjectId | [];
}

export interface IHistorialModel {
  getHistorial(id: ObjectId): Promise<Historial>;
  createHistorial(data: IHistorial): Promise<Historial>;
  updateHistorial(
    profileId: ObjectId,
    data: Partial<Omit<IHistorial, 'userId'>>,
  ): Promise<void>;
}
