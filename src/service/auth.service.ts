import axios from "axios";
import type { Login, LoginResponse } from "../interface/login.interface";

const BASE_URL = "http://localhost:3000/api/";

class AuthService {
  async login(credentials: Login): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}login`,
        credentials,
        {
          withCredentials: true,
        }
      );

      this.setupAxiosInterceptors();

      return response.data;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  }

  logout() {
    axios.defaults.withCredentials = true;
    return axios.post(`${BASE_URL}logout`);
  }

  async isAuthenticated() {
    try {
      const response = await axios.get(`${BASE_URL}check-auth`, {
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
