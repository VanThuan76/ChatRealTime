import { https } from '../configs/https.util';

class AuthService {
  async authenticated(body: { email: string; password: string }){
    return https.post('/login', body)
  }
  async logout(body: {email: string}){
    return https.post('/logout', body)
  }
}

export const authService = new AuthService()
