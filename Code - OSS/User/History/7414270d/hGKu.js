import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td, VStack, Heading } from "@chakra-ui/react";

const App = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);

  const API_URL = "http://localhost:8080/api/users";

  // Função para buscar todos os usuários
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Adicionar usuário
  const addUser = async () => {
    if (!name || !age) return;
    try {
      await axios.post(`${API_URL}`, { name, age });
      setName("");
      setAge("");
      fetchUsers();
    } catch (error) {
      console.error("Erro ao adicionar usuário", error);
    }
  };

  // Buscar usuário pelo ID
  const searchUserById = async () => {
    try {
      const response = await axios.get(`${API_URL}/${searchId}`);
      setSearchedUser(response.data);
    } catch (error) {
      setSearchedUser(null);
      console.error("Usuário não encontrado", error);
    }
  };

  return (
    <VStack spacing={6} p={6}>
      <Heading>Gerenciamento de Usuários</Heading>

      {/* Formulário para adicionar usuário */}
      <Box>
        <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Idade" type="number" value={age} onChange={(e) => setAge(e.target.value)} mt={2} />
        <Button colorScheme="blue" onClick={addUser} mt={2}>Adicionar Usuário</Button>
      </Box>

      {/* Buscar usuário por ID */}
      <Box>
        <Input placeholder="Buscar por ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        <Button colorScheme="green" onClick={searchUserById} mt={2}>Buscar</Button>
      </Box>

      {searchedUser && (
        <Box borderWidth="1px" p={4} borderRadius="md">
          <Heading size="md">Usuário Encontrado:</Heading>
          <p>ID: {searchedUser.id}</p>
          <p>Nome: {searchedUser.name}</p>
          <p>Idade: {searchedUser.age}</p>
        </Box>
      )}

      {/* Lista de usuários */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nome</Th>
            <Th>Idade</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.name}</Td>
              <Td>{user.age}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default App;