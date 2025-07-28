import axios from "axios";
import type { IAbono, IAbonoResponse } from "../interface/abonos.interface";
import config from "../config";

const API = axios.create({
  baseURL: config.apiUrl,
});

export class AbonosService {
  async getAbonos(): Promise<IAbonoResponse[]> {
    try {
      const response = await API.get<{ data: IAbonoResponse[] }>("/abonos");
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error obteniendo abonos:",
          (error as any).response?.data || error.message
        );
      }
      throw error;
    }
  }

  async createAbono(abonoData: IAbono): Promise<IAbonoResponse> {
    try {
      const response = await API.post("/abonos", abonoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateAbono(id: number, abonoData: IAbono): Promise<IAbonoResponse> {
    try {
      const response = await axios.put(`/update/abono/${id}`, abonoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteAbono(id: number): Promise<void> {
    try {
      await API.delete(`/delete/abono/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
