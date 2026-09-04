import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { App } from './App';
import './styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // O backoffice é operacional e o mesmo registro pode mudar em outra aba,
      // por outro operador ou por webhook. Sempre confronte consultas ativas
      // com o servidor ao voltar para a janela ou reconectar.
      refetchOnWindowFocus: 'always',
      refetchOnReconnect: 'always',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
