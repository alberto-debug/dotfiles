import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider, Container } from "@mantine/core";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <MantineProvider>
      <Router>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </MantineProvider>
  );
}

export default App;
