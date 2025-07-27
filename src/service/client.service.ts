import axios from "axios";
import type {
  IClient,
  IClientResponse,
  IUpdateClient,
} from "../interface/client.interface";

const BASE_URL = "http://localhost:3000/api";

export class ClientService {
  async getClients(): Promise<IClientResponse[]> {
    const response = await axios.get(`${BASE_URL}/clients`);
    return response.data.data;
  }

  async createClient(clientData: IClient): Promise<IClientResponse> {
    const response = await axios.post(`${BASE_URL}/client`, clientData);
    return response.data;
  }

  async updateClient(
    id: number,
    clientData: IClient
  ): Promise<IClientResponse> {
    const response = await axios.put(
      `${BASE_URL}/update/client/${id}`,
      clientData
    );
    return response.data;
  }

  async deleteClient(id: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/delete/client/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
