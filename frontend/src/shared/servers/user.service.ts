import { AxiosResponse } from 'axios';
import { https } from '../configs/https.util';
import { IUser } from '../typeDef/auth.type';
import { ICreateUser } from '../typeDef/user.type';

class UserService {
  async getListUser(): Promise<AxiosResponse<IUser[]>>{
    return https.get('/list-user')
  }
  async createUser(body: ICreateUser){
    return https.post('/create-user', body)
  }
  async infoUser(body: {username: string}){
    return https.post('/info-user', body)
  } 
  async getUser(body: {userId: number}){
    return https.post('/user', body)
  } 
}

export const userService = new UserService()
