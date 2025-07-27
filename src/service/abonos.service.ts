import axios from "axios";
import type { IAbono, IAbonoResponse } from "../interface/abonos.interface";

const BASE_URL = "http://localhost:3000/api";

export class AbonosService {
  async getAbonos(): Promise<IAbonoResponse[]> {
    try {
      const response = await axios.get<{ data: IAbonoResponse[] }>(
        `${BASE_URL}/abonos`
      );
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
      const response = await axios.post(`${BASE_URL}/abonos`, abonoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateAbono(id: number, abonoData: IAbono): Promise<IAbonoResponse> {
    try {
      const response = await axios.put(
        `${BASE_URL}/update/abono/${id}`,
        abonoData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteAbono(id: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/delete/abono/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
