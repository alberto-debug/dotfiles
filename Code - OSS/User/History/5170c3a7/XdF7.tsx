import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";

const theme = extendTheme({}); // You can customize the theme if needed

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
