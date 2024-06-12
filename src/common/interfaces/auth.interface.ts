import { ObjectId } from 'mongoose';

export interface UserRequest extends Express.Request {
  user: ITokenPayload;
}

export interface ITokenPayload {
  id: ObjectId;
  role: string;
}
