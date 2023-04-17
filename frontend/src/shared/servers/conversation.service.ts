import { AxiosResponse } from 'axios';
import { https } from '../configs/https.util';
import { IConversation } from '../typeDef/conversation.type';

class ConversationService {
  async getConversation(body: {conversationId: number}): Promise<AxiosResponse<IConversation[]>>{
    return https.post('/conversation', body)
  }
}

export const conversationService = new ConversationService()
