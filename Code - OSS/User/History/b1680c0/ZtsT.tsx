import { Button, Container, Group, MantineProvider, Text, Title } from "@mantine/core";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Container style={{ textAlign: "center", marginTop: 50 }}>
        <Title order={1}>Bem-vindo ao Meu App</Title>
        <Text size="lg" color="gray">
          Este é um app simples usando Mantine UI.
        </Text>
        <Group position="center" mt="md">
          <Button color="blue">Começar</Button>
          <Button variant="outline">Saber mais</Button>
        </Group>
      </Container>
    </MantineProvider>
  );
}

export default App;
