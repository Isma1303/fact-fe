import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider, useDemoRouter } from "@toolpad/core/internal";
import { ClientsDataGrid } from "../components/clientsDataGrid";
import { AbonosDataGrid } from "../components/abonosDataGrid";
import { ComprasDataGrid } from "../components/comprasDataGrid";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import authService from "../service/auth.service";
import { useEffect } from "react";
import type { CustomNavigationItem } from "../interface/navigation.interface";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }: { pathname: string }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
      }}
    >
      {pathname === "/clientes" && <ClientsDataGrid />}
      {pathname === "/abonos" && <AbonosDataGrid />}
      {pathname === "/compras" && <ComprasDataGrid />}
      {!pathname.match(/^\/(clientes|abonos|compras)/) && (
        <Typography>Selecciona una opción del menú lateral.</Typography>
      )}
    </Box>
  );
}

interface DemoProps {
  window?: () => Window;
}

export default function DashboardWithToolpad(props: DemoProps) {
  const { window } = props;
  const navigate = useNavigate();
  const router = useDemoRouter("/clientes");
  const demoWindow = window !== undefined ? window() : undefined;

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/");
    } else {
      authService.setupAxiosInterceptors();
    }
  }, [navigate]);

  const handleNavigation = (segment: string) => {
    if (segment === "logout") {
      handleLogout();
    } else {
      router.navigate(`/${segment}`);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={[
          {
            segment: "clientes",
            title: "Clientes",
            icon: <PeopleIcon />,
            url: "/clientes",
            onClick: () => handleNavigation("clientes"),
          } as CustomNavigationItem,
          {
            segment: "abonos",
            title: "Abonos",
            icon: <MonetizationOnIcon />,
            url: "/abonos",
            onClick: () => handleNavigation("abonos"),
          } as CustomNavigationItem,
          {
            segment: "compras",
            title: "Compras",
            icon: <ReceiptIcon />,
            url: "/compras",
            onClick: () => handleNavigation("compras"),
          } as CustomNavigationItem,
          {
            segment: "logout",
            title: "Cerrar sesión",
            icon: <ExitToAppIcon />,
            url: "/logout",
            onClick: () => handleNavigation("logout"),
          } as CustomNavigationItem,
        ]}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}
