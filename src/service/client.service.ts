import axios from "axios";
import type { IClient, IClientResponse } from "../interface/client.interface";
import config from "../config";

const API = axios.create({
  baseURL: config.apiUrl,
});
export class ClientService {
  async getClients(): Promise<IClientResponse[]> {
    const response = await API.get(`/clients`);
    return response.data.data;
  }

  async createClient(clientData: IClient): Promise<IClientResponse> {
    const response = await API.post(`/client`, clientData);
    return response.data;
  }

  async updateClient(
    id: number,
    clientData: IClient
  ): Promise<IClientResponse> {
    const response = await API.put(`/update/client/${id}`, clientData);
    return response.data;
  }

  async deleteClient(id: number): Promise<void> {
    try {
      await API.delete(`/delete/client/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
