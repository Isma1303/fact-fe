import { useState, useEffect, useCallback } from "react";
import type {
  IClient,
  IClientResponse,
  IUpdateClient,
} from "../interface/client.interface";
import { ClientService } from "../service/client.service";

export function useClients() {
  const [clients, setClients] = useState<IClientResponse[]>([]);
  const clientService = new ClientService();

  const loadClients = useCallback(async () => {
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  }, []);

  const updateClient = useCallback(
    async (id: number, clientData: IUpdateClient) => {
      try {
        await clientService.updateClient(id, clientData as IClient);
        await loadClients();
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
      }
    },
    []
  );

  const deleteClient = useCallback(
    async (id: number) => {
      try {
        await clientService.deleteClient(id);
        await loadClients();
      } catch (error) {
        console.log("error al eliminar cliente", error);
      }
    },
    [loadClients]
  );

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  return { clients, loadClients, updateClient, deleteClient };
}
