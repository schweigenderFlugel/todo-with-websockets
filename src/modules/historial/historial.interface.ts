import { ObjectId } from 'mongoose';
import { Historial } from './historial.schema';

export interface IHistorial {
  made: ObjectId | [];
  succeded: ObjectId | [];
  failed: ObjectId | [];
}

export interface IHistorialModel {
  getHistorial(id: ObjectId): Promise<Historial>;
  createHistorial(data: IHistorial): Promise<Historial>;
  updateHistorial(
    profileId: ObjectId,
    data: Partial<IHistorial>,
  ): Promise<void>;
}
