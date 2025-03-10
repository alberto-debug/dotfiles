import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';

function App() {
  return (
    <Box p={4}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="space-between"
        maxW="1200px"
        mx="auto"
      >
        <VStack align="start" spacing={4} mb={{ base: 4, md: 0 }}>
          <Heading as="h1" size="xl">
            Welcome to My App
          </Heading>
          <Text fontSize="lg">
            This is a simple responsive app built with React, TypeScript, and Chakra UI.
          </Text>
        </VStack>
        <Button colorScheme="teal" size="lg">
          Get Started
        </Button>
      </Flex>
    </Box>
  );
}

export default App;