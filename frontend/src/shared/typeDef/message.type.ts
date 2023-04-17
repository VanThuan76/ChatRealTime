export interface IMessage {
  id: number;
  conversationId: number;
  senderId: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  sender: Sender;
}

interface Sender {
  id: number;
  name: string;
  email: string;
  emailVerified?: any;
  image: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMessageNew{
  newMessage: string,
  conversationId: number,
  senderId: number
}