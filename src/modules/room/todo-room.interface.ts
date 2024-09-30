import { IItem } from '../item/item.interface';
import { ITask } from '../task/task.interface';
import { TaskStatus } from './todo-room.enum';

export interface IClient {
  id: string;
  username: string;
  room?: string | null;
  items?: TaskItems[];
}

export interface IRoom {
  admin: string;
  name: string;
  users?: IClient[];
  chat?: IMessage[];
}

export interface IMessage {
  username: string;
  message: string;
  time: string;
}

export interface TaskItems extends IItem {
  status: TaskStatus;
}

export interface IRoomTask
  extends Omit<Omit<Omit<ITask, 'creator'>, 'updatedAt'>, 'items'> {
  items: TaskItems;
}

export interface ServerToClientsEvents {
  userList: (list: IClient[]) => void;
  roomList: (list: Array<IRoom['name']>) => void;
  activity: (message: string) => void;
  sendMessage: (message: IMessage) => void;
  createRoom: (message: string) => void;
  removeRoom: (message: string) => void;
  enterRoom: (username: IClient['username']) => void;
  leaveRoom: (username: IClient['username']) => void;
  roomChat: (chat: IMessage[]) => void;
  loadTask: (task: IRoomTask) => void;
  startTask: (trigger: boolean) => void;
  taskStatus: (message: string) => void;
}
