import { Paper, Text, Container } from "@mantine/core";

function Footer() {
  return (
    <Paper shadow="xs" p="md" mt="lg">
      <Container style={{ textAlign: "center" }}>
        <Text>© 2024 Meu App. Todos os direitos reservados.</Text>
      </Container>
    </Paper>
  );
}

export default Footer;
