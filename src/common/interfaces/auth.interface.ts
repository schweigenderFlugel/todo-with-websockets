import { ObjectId } from 'mongoose';
import { Role } from "../enums/roles";

export interface UserRequest extends Express.Request {
  user: ITokenPayload;
}

export interface ITokenPayload {
  id: ObjectId;
  role: string;
}