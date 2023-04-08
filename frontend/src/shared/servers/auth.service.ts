import { https } from '../configs/https.util';

class AuthService {
  async authenticated(body: { email: string; password: string }){
    return https.post('/login', body)
  }
}

export const authService = new AuthService()
