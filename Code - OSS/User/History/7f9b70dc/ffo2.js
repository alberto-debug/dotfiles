// Importações necessárias
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Certifique-se de que o caminho para o arquivo App.js está correto
import { ChakraProvider } from '@chakra-ui/react';

// Criação da raiz do React DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderização do componente App dentro do ChakraProvider para suportar os componentes do Chakra UI
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);