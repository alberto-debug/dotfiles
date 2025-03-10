import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react";

const Navbar = () => (
  <Flex as="nav" p={4} bg="red.500" color="white" justify="space-between">
    <Heading size="md">My App</Heading>
    <Button colorScheme="whiteAlpha" variant="outline">Login</Button>
  </Flex>
);

const Hero = () => (
  <Container maxW="container.md" textAlign="center" py={10}>
    <Heading size="xl" mb={4}>Welcome to My App</Heading>
    <Text fontSize="lg" mb={6}>
      This is a simple app using React and Chakra UI.
    </Text>
    <Button colorScheme="red" size="lg">Get Started</Button>
  </Container>
);

const Footer = () => (
  <Box as="footer" p={4} textAlign="center" bg="gray.800" color="white">
    © 2025 My App. All rights reserved.
  </Box>
);

export default function App() {
  return (
    <Box>
      <Navbar />
      <Hero />
      <Footer />
    </Box>
  );
}
