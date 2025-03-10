import { Link } from "react-router-dom";
import { Header, Group, Button } from "@mantine/core";

function Navbar() {
  return (
    <Header height={60} p="md" style={{ display: "flex", justifyContent: "space-between" }}>
      <Group>
        <Link to="/">🏠 Home</Link>
      </Group>
      <Group>
        <Button component={Link} to="/login" variant="outline">
          Login
        </Button>
        <Button component={Link} to="/register">Registrar</Button>
      </Group>
    </Header>
  );
}

export default Navbar;
