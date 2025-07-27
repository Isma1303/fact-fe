import React, { useState, useEffect } from "react";
import { DataGrid, type GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type {
  ISaleResponse,
  IUpdateCompra,
} from "../interface/sales.interface";
import { useCompras } from "../hooks/useCompras";

export const ComprasDataGrid: React.FC = () => {
  const { compras, clients, loadCompras, deleteCompra, updateCompra } =
    useCompras();
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<number>(0);
  const [selectedCompra, setSelectedCompra] = useState<ISaleResponse | null>(
    null
  );

  const [formData, setFormData] = useState<IUpdateCompra>({
    nombre_compra: "",
    monto_total: 0,
    fecha_compra: "",
    pagado: false,
  });

  const handleEdit = (compra: ISaleResponse) => {
    setSelectedCompra(compra);
    setSelectedClient(compra.cliente_id);
    setFormData({
      nombre_compra: compra.nombre_compra,
      monto_total: compra.monto_total,
      fecha_compra: compra.fecha_compra.split("T")[0],
      pagado: compra.pagado,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta compra?")) {
      try {
        await deleteCompra(id);
        await loadCompras();
      } catch (error) {
        console.error("Error deleting sale:", error);
      }
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedClient) {
      alert("Seleccione un cliente válido");
      return;
    }

    const compraActualizada: IUpdateCompra = {
      ...formData,
      cliente_id: selectedClient,
    };

    try {
      if (selectedCompra) {
        await updateCompra(selectedCompra.id, compraActualizada);
      } else {
        console.warn("Agregar nueva compra aún no implementado");
      }

      setOpen(false);
      await loadCompras();
    } catch (error) {
      console.error("Error saving sale:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "nombre_compra",
      headerName: "Nombre de Compra",
      width: 200,
    },
    {
      field: "cliente_name",
      headerName: "Cliente",
      width: 200,
    },
    {
      field: "monto_total",
      headerName: "Total",
      width: 130,
      renderCell: (params) => {
        const value = params.value as number;
        return `Q${value.toFixed(2)}`;
      },
    },
    {
      field: "fecha_compra",
      headerName: "Fecha",
      width: 200,
      renderCell(params) {
        const date = new Date(params.value);
        return date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      field: "pagado",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => {
        const pagado = params.row.pagado;
        return (
          <Chip
            icon={pagado ? <CheckCircleIcon /> : <CancelIcon />}
            label={pagado ? "Pagado" : "Pendiente"}
            color={pagado ? "success" : "error"}
            variant="filled"
            size="small"
            sx={{
              width: "90px",
              "& .MuiChip-icon": {
                fontSize: "20px",
              },
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 200,
      renderCell: (params) => {
        const row = params.row as ISaleResponse;
        return (
          <Box>
            <Button onClick={() => handleEdit(row)} color="primary">
              Editar
            </Button>
            <Button onClick={() => handleDelete(row.id)} color="error">
              Eliminar
            </Button>
          </Box>
        );
      },
    },
  ];
  return (
    <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      <Box sx={{ mb: 2 }}>
        <Button
          onClick={() => {
            setSelectedCompra(null);
            setSelectedClient(0);
            setFormData({
              nombre_compra: "",
              monto_total: 0,
              fecha_compra: new Date().toISOString().split("T")[0],
              pagado: false,
            });
            setOpen(true);
          }}
          variant="contained"
          color="primary"
        >
          Agregar Compra
        </Button>
        <Button onClick={loadCompras} variant="outlined" sx={{ ml: 1 }}>
          Actualizar
        </Button>
      </Box>

      <DataGrid
        rows={compras}
        columns={columns}
        getRowId={(row) => row.id}
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
            {selectedCompra ? "Editar Compra" : "Nueva Compra"}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel id="client-select-label">Cliente</InputLabel>
              <Select
                labelId="client-select-label"
                name="client_id"
                value={selectedClient}
                label="Cliente"
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedClient(Number(value));
                }}
                required
              >
                <MenuItem value="">Seleccione un cliente</MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="nombre_compra"
              label="Nombre de Compra"
              type="text"
              fullWidth
              value={formData.nombre_compra}
              onChange={(e) =>
                setFormData({ ...formData, nombre_compra: e.target.value })
              }
              required
            />

            <TextField
              margin="dense"
              name="total"
              label="Total"
              type="number"
              fullWidth
              value={formData.monto_total}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monto_total: parseFloat(e.target.value || "0"),
                })
              }
              required
              inputProps={{ min: "0", step: "0.01" }}
            />

            <TextField
              margin="dense"
              name="fecha_compra"
              label="Fecha"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.fecha_compra}
              onChange={(e) =>
                setFormData({ ...formData, fecha_compra: e.target.value })
              }
              required
            />

            <FormControl fullWidth margin="dense" required>
              <InputLabel id="pagado-select-label">Estado de Pago</InputLabel>
              <Select
                labelId="pagado-select-label"
                name="pagado"
                value={String(formData.pagado)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pagado: e.target.value === "true",
                  })
                }
                label="Estado de Pago"
              >
                <MenuItem value="true">Pagado</MenuItem>
                <MenuItem value="false">Pendiente</MenuItem>
              </Select>
            </FormControl>
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
};
