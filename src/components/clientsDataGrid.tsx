import { useState, useEffect } from "react";
import { DataGrid, type GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useClients } from "../hooks/useClients";
import type {
  IClientResponse,
  IUpdateClient,
} from "../interface/client.interface";

export function ClientsDataGrid() {
  const { clients, updateClient, deleteClient, loadClients } = useClients();
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IClientResponse | null>(
    null
  );

  useEffect(() => {
    loadClients();
  }, []);
  const [formData, setFormData] = useState<IUpdateClient>({
    nombre: "",
    telefono: "",
  });

  const handleEdit = (client: IClientResponse) => {
    setSelectedClient(client);
    setFormData({
      nombre: client.nombre,
      telefono: client.telefono,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await deleteClient(id);
        await loadClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedClient) return;

    try {
      await updateClient(selectedClient.id, formData);
      setOpen(false);
      await loadClients();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 200, editable: true },
    { field: "telefono", headerName: "Teléfono", width: 150, editable: true },
    {
      field: "actions",
      headerName: "Acciones",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button onClick={() => handleEdit(params.row)} color="primary">
            Editar
          </Button>
          <Button onClick={() => handleDelete(params.row.id)} color="error">
            Eliminar
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      <Box sx={{ mb: 2 }}>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          color="primary"
        >
          Agregar Cliente
        </Button>
        <Button onClick={loadClients} variant="outlined" sx={{ ml: 1 }}>
          Actualizar
        </Button>
      </Box>

      <DataGrid
        rows={clients}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        slots={{ toolbar: GridToolbar }}
        sx={{ minHeight: 400 }}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSave}>
          <DialogTitle>
            {selectedClient ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="nombre"
              label="Nombre"
              fullWidth
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
            <TextField
              margin="dense"
              name="telefono"
              label="Teléfono"
              fullWidth
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
