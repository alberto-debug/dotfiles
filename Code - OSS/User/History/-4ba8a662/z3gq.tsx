import { Box, Flex, Heading, Spacer, Button } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box bg="blue.500" p={4} color="white">
      <Flex maxW="container.lg" mx="auto" align="center">
        <Heading size="md">MyApp</Heading>
        <Spacer />
        <Button colorScheme="whiteAlpha" variant="outline">Login</Button>
      </Flex>
    </Box>
  );
};

export default Navbar;
