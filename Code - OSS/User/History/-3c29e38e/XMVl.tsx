import { Link } from "react-router-dom";
import { Paper, Group, Button, Container } from "@mantine/core";

function Navbar() {
  return (
    <Paper shadow="xs" p="md">
      <Container style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Group>
          <Link to="/">🏠 Home</Link>
        </Group>
        <Group>
          <Button component={Link} to="/login" variant="outline">
            Login
          </Button>
          <Button component={Link} to="/register">Registrar</Button>
        </Group>
      </Container>
    </Paper>
  );
}

export default Navbar;
