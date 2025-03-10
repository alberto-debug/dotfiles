import { createTheme } from "@mantine/core";

const theme = createTheme({
  colors: {
    primary: ["#001f3f", "#003366", "#004080", "#00509d", "#0066cc"],
    secondary: ["#ff4d4d", "#ff6666", "#ff8080", "#ff9999", "#ffb3b3"],
  },
  fontFamily: "Inter, sans-serif",
  primaryColor: "primary",
});

export default theme;
