import { IParticipant } from "./conversation.type";

export interface IUser{
    id: number,
    name: string,
    image: string,
    username: string,
    email: string,
    password: string,
    conversations: IParticipant[]
    messages: String[],
    active: number
}