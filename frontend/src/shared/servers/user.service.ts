import { AxiosResponse } from 'axios';
import { https } from '../configs/https.util';
import { IUser } from '../typeDef/auth.type';

class UserService {
  async getListUser(): Promise<AxiosResponse<IUser[]>>{
    return https.get('/list-user')
  }
}

export const userService = new UserService()
