import { useState, useEffect, useCallback } from "react";
import type {
  ISale,
  ISaleResponse,
  IUpdateCompra,
} from "../interface/sales.interface";
import type { IClientResponse } from "../interface/client.interface";
import { SalesService } from "../service/sales.service";
import { ClientService } from "../service/client.service";

export function useCompras() {
  const [compras, setCompras] = useState<ISaleResponse[]>([]);
  const [clients, setClients] = useState<IClientResponse[]>([]);
  const salesService = new SalesService();
  const clientService = new ClientService();

  const loadClients = useCallback(async () => {
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  }, []);

  const loadCompras = useCallback(async () => {
    try {
      const data = await salesService.getSales();
      if (Array.isArray(data)) {
        const processedData = data.map((compra) => {
          const client = clients.find(
            (c) => c.id === Number(compra.cliente_id)
          );

          return {
            ...compra,
            id: compra.id || 0,
            cliente_name: client ? client.nombre : "Desconocido",
            nombre_compra: compra.nombre_compra || "",
            monto_total:
              compra.monto_total && !isNaN(Number(compra.monto_total))
                ? Number(compra.monto_total)
                : 0,
            fecha_compra: compra.fecha_compra
              ? new Date(compra.fecha_compra).toISOString()
              : "",
            pagado: compra.pagado !== null ? Boolean(compra.pagado) : false,
          };
        });
        setCompras(processedData);
      } else {
        console.error("Los datos recibidos no son un array:", data);
      }
    } catch (error) {
      console.error("Error al cargar las compras:", error);
    }
  }, [clients]);

  const deleteCompra = useCallback(
    async (id: number) => {
      try {
        await salesService.deleteSale(id);
        await loadClients();
      } catch (error) {
        console.log("error al eliminar compra", error);
      }
    },
    [loadCompras]
  );
  const updateCompra = useCallback(
    async (id: number, compraData: IUpdateCompra) => {
      try {
        await salesService.updateSale(id, compraData as ISale);
        await loadCompras();
      } catch (error) {
        console.log("error al actualizar compra", error);
      }
    },
    [loadCompras]
  );
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    if (clients.length > 0) {
      loadCompras();
    }
  }, [clients, loadCompras]);

  return { compras, clients, loadCompras, deleteCompra, updateCompra };
}
