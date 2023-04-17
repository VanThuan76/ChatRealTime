import { AxiosResponse } from 'axios';
import { https } from '../configs/https.util';
import { IMessage, IMessageNew } from '../typeDef/message.type';

class MessageService {
  async getMessage(body: {senderId: number}): Promise<AxiosResponse<IMessage[]>>{
    return https.post('/message', body)
  }
  async newMessage(body: IMessageNew): Promise<AxiosResponse<IMessage[]>>{
    return https.post('/new-message', body)
  }
}

export const messageService = new MessageService()
