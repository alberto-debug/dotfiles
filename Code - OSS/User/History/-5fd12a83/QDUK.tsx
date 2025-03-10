import { TextInput, PasswordInput, Button, Container, Title } from "@mantine/core";

function Login() {
  return (
    <Container style={{ maxWidth: 400, marginTop: 50 }}>
      <Title order={2}>Login</Title>
      <TextInput label="Email" placeholder="seuemail@email.com" required />
      <PasswordInput label="Senha" placeholder="••••••••" required mt="md" />
      <Button fullWidth mt="md">Entrar</Button>
    </Container>
  );
}

export default Login;
