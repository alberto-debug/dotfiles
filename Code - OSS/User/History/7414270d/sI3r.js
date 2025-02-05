import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Heading, Input, Button, VStack, List, ListItem, Text } from "@chakra-ui/react";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const API_URL = "http://localhost:8080/api/";

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
    <Box textAlign="center" p={4}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Text fontSize="xl">Edit <code>src/App.js</code> and save to reload.</Text>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        {/* Formulário para adicionar usuário */}
        <VStack spacing={4} mt={8}>
          <Heading size="md">Adicionar Usuário</Heading>
          <Input 
            placeholder="Nome" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <Input 
            placeholder="Idade" 
            type="number" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
          />
          <Button colorScheme="blue" onClick={addUser}>Adicionar Usuário</Button>
        </VStack>

        {/* Buscar usuário por ID */}
        <VStack spacing={4} mt={8}>
          <Heading size="md">Buscar Usuário</Heading>
          <Input 
            placeholder="Buscar por ID" 
            value={searchId} 
            onChange={(e) => setSearchId(e.target.value)} 
          />
          <Button colorScheme="green" onClick={searchUserById}>Buscar</Button>
        </VStack>

        {searchedUser && (
          <Box borderWidth="1px" p={4} borderRadius="md" mt={4}>
            <Heading size="sm">Usuário Encontrado:</Heading>
            <Text>ID: {searchedUser.id}</Text>
            <Text>Nome: {searchedUser.name}</Text>
            <Text>Idade/XMLSchema Schema Documentation: {searchedUser.age}</Text>
          </Box>
        )}

        {/* Lista de usuários */}
        <Box mt={8}>
          <Heading size="md">Lista de Usuários</Heading>
          <List>
            <ListItem fontWeight="bold">ID | Nome | Idade</ListItem>
            {users.map((user) => (
              <ListItem key={user.id}>{user.id} | {user.name} | {user.age}</ListItem>
            ))}
          </List>
        </Box>
      </header>
    </Box>
  );
}

export default App;