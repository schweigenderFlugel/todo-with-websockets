export interface IClient {
  id: string;
  username: string;
  room?: string | null;
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

export interface ServerToClientsEvents {
  userList: (list: IClient[]) => void;
  roomsList: (list: Array<IRoom['name']>) => void;
  activity: (message: string) => void;
  sendMessage: (message: IMessage) => void;
  createRoom: (message: string) => void;
  removeRoom: (message: string) => void;
  enterRoom: (username: IClient['username']) => void;
  leaveRoom: (username: IClient['username']) => void;
  roomChat: (chat: IMessage[]) => void;
}