import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Auth } from "./auth.schema";
import { IAuth, IAuthModel } from "./auth.interface";

@Injectable()
export class AuthModel implements IAuthModel {
  constructor(@InjectModel(Auth.name) private readonly model: Model<Auth>) {}

  async getSessions(id: ObjectId): Promise<Auth[]> {
    return await this.model.find({ userId: id })
  }

  async createSession(id: ObjectId, data: IAuth): Promise<void> {
    const newSession = await this.model.create({ userId: id, ...data });
  }

  async updateSession(id: ObjectId, data: Partial<IAuth>): Promise<void> {
    await this.model.findOneAndUpdate({ id, ...data });
  }

  async deleteSession(id: ObjectId): Promise<void> {
    await this.model.findOneAndDelete(id);
  }
}