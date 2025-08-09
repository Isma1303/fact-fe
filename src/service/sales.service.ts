import axios, { type AxiosError } from "axios";
import type { ISale, ISaleResponse } from "../interface/sales.interface";
import config from "../config";
const API = axios.create({
  baseURL: config.apiUrl,
});

export class SalesService {
  async getSales(): Promise<ISaleResponse[]> {
    try {
      const response = await API.get(`/compras`);
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error obteniendo ventas:",
          (error as AxiosError).response?.data || error.message
        );
      }
      throw error;
    }
  }

  async createSale(saleData: ISale): Promise<ISaleResponse> {
    try {
      const dataToSend = {
        cliente_id: Number(saleData.cliente_id),
        monto_total: Number(saleData.monto_total),
        fecha_compra: saleData.fecha_compra,
        pagado: saleData.pagado,
        nombre_compra: saleData.nombre_compra,
      };

      const response = await API.post(`/compras`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error en createSale:",
          (error as AxiosError).response?.data || error.message
        );
      }
      throw error;
    }
  }

  async updateSale(id: number, saleData: ISale): Promise<ISaleResponse> {
    try {
      const dataToSend = {
        cliente_id: Number(saleData.cliente_id),
        monto_total: Number(saleData.monto_total),
        fecha_compra: saleData.fecha_compra,
        pagado: saleData.pagado,
        nombre_compra: saleData.nombre_compra,
      };
      const response = await API.put(`/update/compra/${id}`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error actualizando venta:",
          (error as AxiosError).response?.data || error.message
        );
      }
      throw error;
    }
  }

  async deleteSale(id: number): Promise<void> {
    try {
      await API.delete(`/delete/compra/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error eliminando venta:",
          (error as AxiosError).response?.data || error.message
        );
      }
      throw error;
    }
  }
}
