import axios from "axios";
import type { Login, LoginResponse } from "../interface/login.interface";
import config from "../config";

const API = axios.create({
  baseURL: config.apiUrl,
});
class AuthService {
  async login(credentials: Login): Promise<LoginResponse> {
    try {
      const response = await API.post<LoginResponse>(`login`, credentials, {
        withCredentials: true,
      });

      this.setupAxiosInterceptors();

      return response.data;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  }

  logout() {
    axios.defaults.withCredentials = true;
    return API.post(`logout`);
  }

  async isAuthenticated() {
    try {
      const response = await API.get(`check-auth`, {
        withCredentials: true,
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  setupAxiosInterceptors() {
    axios.defaults.withCredentials = true;
  }
}

const authService = new AuthService();
export default authService;
