import { Box, SimpleGrid, Heading, Text } from "@chakra-ui/react";

const CardSection = () => {
  const cards = [
    { title: "Feature One", description: "Description for feature one." },
    { title: "Feature Two", description: "Description for feature two." },
    { title: "Feature Three", description: "Description for feature three." },
  ];

  return (
    <Box py={10} bg="gray.100">
      <Heading textAlign="center" mb={6}>Our Features</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} maxW="container.lg" mx="auto">
        {cards.map((card, index) => (
          <Box key={index} p={5} bg="white" shadow="md" borderRadius="md">
            <Heading size="md">{card.title}</Heading>
            <Text mt={2}>{card.description}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CardSection;
