import { useState, useEffect, useCallback } from "react";
import type { IAbono, IAbonoResponse } from "../interface/abonos.interface";
import type { IClientResponse } from "../interface/client.interface";
import type { ISaleResponse } from "../interface/sales.interface";
import { AbonosService } from "../service/abonos.service";
import { ClientService } from "../service/client.service";
import { SalesService } from "../service/sales.service";

export function useAbonos() {
  const [abonos, setAbonos] = useState<IAbonoResponse[]>([]);
  const [clients, setClients] = useState<IClientResponse[]>([]);
  const [sales, setSales] = useState<ISaleResponse[]>([]);
  const abonosService = new AbonosService();
  const clientService = new ClientService();
  const salesService = new SalesService();

  const loadAbonos = useCallback(async () => {
    try {
      const data = await abonosService.getAbonos();
      if (Array.isArray(data)) {
        const processedData = data.map((abono) => {
          const client = clients.find((c) => c.id === abono.cliente_id);
          return {
            ...abono,
            id: abono.id || 0,
            cliente_name: client ? client.nombre : "Desconocido",
            compra_id:
              typeof abono.compra_id === "object"
                ? abono.compra_id.id
                : abono.compra_id,
            monto_abono: abono.monto_abono ? Number(abono.monto_abono) : 0,
            fecha_abono: abono.fecha_abono
              ? new Date(abono.fecha_abono).toISOString()
              : "",
            description: abono.description || "",
          };
        });
        setAbonos(processedData);
      } else {
        console.error("Los datos recibidos no son un array:", data);
      }
    } catch (error) {
      console.error("Error al cargar los abonos:", error);
    }
  }, [clients]);

  const loadClients = async () => {
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  const loadSales = async () => {
    try {
      const data = await salesService.getSales();
      setSales(data);
    } catch (error) {
      console.error("Error loading sales:", error);
    }
  };
  const createAbono = async (abonoData: IAbono) => {
    abonosService.createAbono(abonoData);
    await loadAbonos();
  };
  const deleteAbono = useCallback(async (id: number) => {
    try {
      await abonosService.deleteAbono(id);
      await loadAbonos();
    } catch (error) {
      console.log("error al eliminar abono", error);
    }
  }, []);

  const updateAbono = useCallback(
    async (id: number, data: IAbono) => {
      try {
        await abonosService.updateAbono(id, data as IAbono);
        await loadAbonos();
      } catch (error) {}
    },
    [loadAbonos]
  );

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    loadSales();
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      loadAbonos();
    }
  }, [clients]);

  return {
    abonos,
    clients,
    sales,
    loadAbonos,
    deleteAbono,
    updateAbono,
    createAbono,
  };
}
