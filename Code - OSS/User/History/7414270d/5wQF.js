import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import axios from "axios";

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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        {/* Formulário para adicionar usuário */}
        <div className="user-form">
          <h2>Adicionar Usuário</h2>
          <input 
            type="text" 
            placeholder="Nome" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="form-input"
          />
          <input 
            type="number" 
            placeholder="Idade" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            className="form-input"
          />
          <button onClick={addUser} className="form-button">Adicionar Usuário</button>
        </div>

        {/* Buscar usuário por ID */}
        <div className="user-search">
          <h2>Buscar Usuário</h2>
          <input 
            type="text" 
            placeholder="Buscar por ID" 
            value={searchId} 
            onChange={(e) => setSearchId(e.target.value)} 
            className="form-input"
          />
          <button onClick={searchUserById} className="form-button">Buscar</button>
        </div>

        {searchedUser && (
          <div className="user-details">
            <h3>Usuário Encontrado:</h3>
            <p>ID: {searchedUser.id}</p>
            <p>Nome: {searchedUser.name}</p>
            <p>Idade: {searchedUser.age}</p>
          </div>
        )}

        {/* Lista de usuários */}
        <div className="user-list">
          <h2>Lista de Usuários</h2>
          <ul>
            <li><strong>ID | Nome | Idade</strong></li>
            {users.map((user) => (
              <li key={user.id}>{user.id} | {user.name} | {user.age}</li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;