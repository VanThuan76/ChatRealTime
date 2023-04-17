export interface IConversation {
  id: number;
  latestMessageId: number;
  createdAt: string;
  updatedAt: string;
  participants: IParticipant[];
}

export interface IParticipant {
  id: number;
  userId: number;
  conversationId: number;
  hasSeenLatestMessage: boolean;
  user: User | undefined;
}

interface User {
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

