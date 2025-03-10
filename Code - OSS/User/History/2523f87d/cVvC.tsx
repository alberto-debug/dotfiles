import { Footer as MantineFooter, Text, Container } from "@mantine/core";

function Footer() {
  return (
    <MantineFooter height={60} p="md">
      <Container style={{ textAlign: "center" }}>
        <Text>© 2024 Meu App. Todos os direitos reservados.</Text>
      </Container>
    </MantineFooter>
  );
}

export default Footer;
