import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/global.scss';
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Nunito, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#00BDD3",
    },
    error: {
      main: "#CB3D40",
    },
  },
});

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles styles={{ body: { backgroundColor: '#F8F8F8' } }} />
            <App />
          </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
