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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { IAbonoResponse } from "../interface/abonos.interface";
import { useAbonos } from "../hooks/useAbonos";

export function AbonosDataGrid() {
  const {
    abonos,
    clients,
    sales,
    loadAbonos,
    updateAbono,
    createAbono,
    deleteAbono,
  } = useAbonos();
  const [open, setOpen] = useState(false);

  const [selectedAbono, setSelectedAbono] = useState<IAbonoResponse | null>(
    null
  );

  useEffect(() => {
    loadAbonos();
  }, [loadAbonos]);

  const [formData, setFormData] = useState({
    cliente_id: 0,
    compra_id: 0,
    monto_abono: 0,
    fecha_abono: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleEdit = (abono: IAbonoResponse) => {
    const compra_id =
      typeof abono.compra_id === "object"
        ? abono.compra_id.id
        : abono.compra_id;

    setSelectedAbono(abono);
    setFormData({
      cliente_id: abono.cliente_id,
      compra_id,
      monto_abono: abono.monto_abono,
      fecha_abono: abono.fecha_abono.split("T")[0],
      description: abono.description || "",
    });
    setOpen(true);
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteAbono(id);
      loadAbonos();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (selectedAbono && selectedAbono.id > 0) {
        await updateAbono(selectedAbono.id, formData);
      } else {
        await createAbono(formData);
      }

      setOpen(false);
      await loadAbonos();
    } catch (error) {
      console.error("Error saving abono:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "cliente_name",
      headerName: "Cliente",
      width: 200,
    },
    {
      field: "compra_id",
      headerName: "Compra",
      width: 200,
      renderCell: (params) => {
        const compraId = params.value;
        const compra = sales.find((e) => e.id === compraId);
        return compra?.nombre_compra || "Compra no disponible";
      },
    },
    {
      field: "monto_abono",
      headerName: "Monto",
      width: 130,
      renderCell: (params) => {
        const value = params.value as number;
        return `Q${value.toFixed(2)}`;
      },
    },
    {
      field: "fecha_abono",
      headerName: "Fecha",
      width: 130,
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
      field: "description",
      headerName: "Descripción",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 200,
      renderCell: (params) => {
        const row = params.row as IAbonoResponse;

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
            setSelectedAbono({
              id: 0,
              cliente_id: 0,
              compra_id: 0,
              monto_abono: 0,
              fecha_abono: new Date().toISOString().split("T")[0],
              description: "",
            });
            setOpen(true);
          }}
          variant="contained"
          color="primary"
        >
          Agregar Abono
        </Button>

        <Button onClick={loadAbonos} variant="outlined" sx={{ ml: 1 }}>
          Actualizar
        </Button>
      </Box>

      <DataGrid
        rows={abonos}
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
            {selectedAbono ? "Editar Abono" : "Nuevo Abono"}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel id="client-select-label">Cliente</InputLabel>
              <Select
                labelId="client-select-label"
                name="cliente_id"
                value={formData.cliente_id}
                label="Cliente"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cliente_id: Number(e.target.value),
                  })
                }
                required
              >
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.nombre}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No hay clientes disponibles</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel id="compra-select-label">Compra</InputLabel>
              <Select
                labelId="compra-select-label"
                name="compra_id"
                value={formData.compra_id}
                label="Compra"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    compra_id: Number(e.target.value),
                  })
                }
                required
              >
                {sales.length > 0 ? (
                  sales.map((sale) => (
                    <MenuItem key={sale.id} value={sale.id}>
                      {sale.nombre_compra}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No hay compras disponibles</MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="monto_abono"
              label="Monto"
              type="number"
              fullWidth
              value={formData.monto_abono}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monto_abono: parseFloat(e.target.value || "0"),
                })
              }
              required
              inputProps={{ min: "0", step: "0.01" }}
            />

            <TextField
              margin="dense"
              name="fecha_abono"
              label="Fecha"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.fecha_abono}
              onChange={(e) =>
                setFormData({ ...formData, fecha_abono: e.target.value })
              }
              required
            />

            <TextField
              margin="dense"
              name="description"
              label="Descripción"
              type="text"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
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
