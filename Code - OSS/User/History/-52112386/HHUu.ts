// src/theme.ts
import { extendTheme } from '@chakra-ui/react'; // Import extendTheme

const theme = extendTheme({
  colors: {
    brand: {
      500: '#319795', // Teal color
    },
  },
});

export default theme;