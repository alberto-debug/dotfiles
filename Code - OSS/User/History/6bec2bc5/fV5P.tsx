import { TextInput, PasswordInput, Button, Container, Title } from "@mantine/core";

function Register() {
  return (
    <Container style={{ maxWidth: 400, marginTop: 50 }}>
      <Title order={2}>Registrar</Title>
      <TextInput label="Nome" placeholder="Seu nome" required />
      <TextInput label="Email" placeholder="seuemail@email.com" required mt="md" />
      <PasswordInput label="Senha" placeholder="••••••••" required mt="md" />
      <Button fullWidth mt="md">Criar Conta</Button>
    </Container>
  );
}

export default Register;
