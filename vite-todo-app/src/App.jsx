import React, { useState, useEffect } from "react";
import './App.css'; // Importa o arquivo CSS

export default function App() {
  // Estados para os campos do formulário originais + o novo campo
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [idade, setIdade] = useState("");
  const [pedidos, setPedidos] = useState(""); // Novo campo
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Efeito para carregar os usuários do localStorage
  useEffect(() => {
    try {
      const dadosSalvos = localStorage.getItem("usuarios");
      if (dadosSalvos) {
        setUsuarios(JSON.parse(dadosSalvos));
      }
    } catch (e) {
      console.error("Erro ao carregar dados do localStorage:", e);
    }
  }, []);

  // Efeito para salvar a lista de usuários no localStorage
  useEffect(() => {
    // Só salva se a lista não estiver vazia para evitar sobrescrever com nada
    if (usuarios.length > 0) {
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
  }, [usuarios]);

  // Função para adicionar ou editar um usuário
  const adicionarOuEditarUsuario = () => {
    // Validação dos campos
    if (nome.trim() === "" || sobrenome.trim() === "" || idade === "" || pedidos === "") {
      setErro("Por favor, preencha todos os campos!");
      return;
    }
    
    const idadeNum = Number(idade);
    const pedidosNum = Number(pedidos);

    if (isNaN(idadeNum) || idadeNum <= 0 || isNaN(pedidosNum) || pedidosNum < 0) {
      setErro("Digite uma idade e quantidade de pedidos válidos!");
      return;
    }

    const usuario = { 
      nome: nome.trim(), 
      sobrenome: sobrenome.trim(), 
      idade: idadeNum,
      pedidos: pedidosNum, // Adiciona o novo campo ao objeto
    };

    if (editIndex !== null) {
      const novosUsuarios = [...usuarios];
      novosUsuarios[editIndex] = usuario;
      setUsuarios(novosUsuarios);
      setEditIndex(null);
    } else {
      setUsuarios([...usuarios, usuario]);
    }

    // Limpa os campos do formulário
    setNome("");
    setSobrenome("");
    setIdade("");
    setPedidos("");
    setErro("");
  };

  // Função para preencher o formulário para edição
  const editarUsuario = (index) => {
    const usuarioParaEditar = usuarios[index];
    setNome(usuarioParaEditar.nome);
    setSobrenome(usuarioParaEditar.sobrenome);
    setIdade(usuarioParaEditar.idade);
    setPedidos(usuarioParaEditar.pedidos); // Preenche o novo campo
    setEditIndex(index);
  };

  // Função para remover um usuário
  const removerUsuario = (index) => {
    const novosUsuarios = usuarios.filter((_, i) => i !== index);
    setUsuarios(novosUsuarios);

    // Se a lista ficar vazia após a remoção, limpa o localStorage
    if (novosUsuarios.length === 0) {
      localStorage.removeItem("usuarios");
    }

    if (editIndex === index) {
      setNome("");
      setSobrenome("");
      setIdade("");
      setPedidos("");
      setEditIndex(null);
    }
  };

  // Filtra a lista de usuários
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Cadastro de Usuários</h1>
      
      <div className="form-group">
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input type="text" placeholder="Sobrenome" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} />
        <input type="number" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} />
        <input type="number" placeholder="Quantidade de Pedidos" value={pedidos} onChange={(e) => setPedidos(e.target.value)} />
        <button onClick={adicionarOuEditarUsuario}>
          {editIndex !== null ? "Atualizar" : "Adicionar"}
        </button>
      </div>
      
      {erro && <p className="error-message">{erro}</p>}
      
      <div className="search-container">
        <input type="text" placeholder="Buscar por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>
      
      {usuariosFiltrados.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Sobrenome</th>
                <th>Idade</th>
                <th>Pedidos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario, index) => (
                <tr key={index}>
                  <td>{usuario.nome}</td>
                  <td>{usuario.sobrenome}</td>
                  <td>{usuario.idade}</td>
                  <td>{usuario.pedidos}</td>
                  <td>
                    <div className="actions">
                      <button onClick={() => editarUsuario(index)} className="edit-btn">Editar</button>
                      <button onClick={() => removerUsuario(index)} className="remove-btn">Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}