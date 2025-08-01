import { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Container,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../service/auth.service";

export default function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.login({ userName, password });
      if (response.message.trim() === "Login exitoso") {
        navigate("/home");
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      setError(
        "Error al intentar iniciar sesión. Por favor, intente nuevamente."
      );
      console.error("Error de login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          className="p-10 rounded-3xl shadow-2xl"
          style={{ minWidth: "400px", padding: "3rem" }}
        >
          {/* Título más grande */}
          <Typography
            variant="h3"
            align="center"
            className="font-bold text-gray-800 mb-8"
          >
            Iniciar Sesión
          </Typography>

          <Box
            component="form"
            // onSubmit={handleSubmit}
            className="flex flex-col gap-8"
          >
            <TextField
              label="Usuario"
              variant="outlined"
              fullWidth
              size="medium"
              InputProps={{
                style: { fontSize: "1.2rem", padding: "10px" },
              }}
              InputLabelProps={{
                style: { fontSize: "1.1rem" },
              }}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              size="medium"
              InputProps={{
                style: { fontSize: "1.2rem", padding: "10px" },
              }}
              InputLabelProps={{
                style: { fontSize: "1.1rem" },
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              // type=""
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              style={{
                padding: "14px 0",
                fontSize: "1.2rem",
                borderRadius: "12px",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Entrar"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
