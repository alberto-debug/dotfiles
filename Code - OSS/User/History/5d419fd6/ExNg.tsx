import { Box, Container, Heading, Text, Button, VStack } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CardSection from "./components/CardSection";

const App = () => {
  return (
    <Box>
      <Navbar />
      <Container maxW="container.md" py={10}>
        <VStack textAlign="center">
          <Heading size="xl">Welcome to My Chakra UI App</Heading>
          <Text fontSize="lg">This is a simple responsive app built with React and Chakra UI.</Text>
          <Button colorScheme="blue">Get Started</Button>
        </VStack>
      </Container>
      <CardSection />
      <Footer />
    </Box>
  );
};

export default App;
