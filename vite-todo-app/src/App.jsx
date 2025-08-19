import React, { useState, useEffect } from "react";

// O componente principal do aplicativo
export default function App() {
  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [idade, setIdade] = useState(""); 
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [editIndex, setEditIndex] = useState(null); 

  // Efeito para carregar os usuários do localStorage quando o componente é montado
  useEffect(() => {
    try {
      const dados = localStorage.getItem("usuarios");
      if (dados) {
        setUsuarios(JSON.parse(dados));
      }
    } catch (e) {
      console.error("Erro ao carregar dados do localStorage:", e);
    }
  }, []);

  // Efeito para salvar a lista de usuários no localStorage sempre que ela for alterada
  useEffect(() => {
    try {
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    } catch (e) {
      console.error("Erro ao salvar dados no localStorage:", e);
    }
  }, [usuarios]);

  // Função para adicionar um novo usuário ou atualizar um existente
  const adicionarOuEditarUsuario = () => {
    // Validação dos campos
    if (nome.trim() === "" || sobrenome.trim() === "" || idade === "") {
      setErro("Por favor, preencha todos os campos!");
      return;
    }

    const idadeNum = Number(idade);
    if (isNaN(idadeNum) || idadeNum <= 0) {
      setErro("Digite uma idade válida!");
      return;
    }

    const usuario = { nome: nome.trim(), sobrenome: sobrenome.trim(), idade: idadeNum };

    if (editIndex !== null) {
      // Se for um modo de edição, atualiza o usuário existente
      const novosUsuarios = [...usuarios];
      novosUsuarios[editIndex] = usuario;
      setUsuarios(novosUsuarios);
      setEditIndex(null);
    } else {
      // Caso contrário, adiciona um novo usuário à lista
      setUsuarios([...usuarios, usuario]);
    }

    // Limpa os campos do formulário
    setNome("");
    setSobrenome("");
    setIdade("");
    setErro("");
  };

  // Função para preencher o formulário com os dados de um usuário para edição
  const editarUsuario = (index) => {
    const usuario = usuarios[index];
    setNome(usuario.nome);
    setSobrenome(usuario.sobrenome);
    setIdade(usuario.idade);
    setEditIndex(index);
  };

  // Função para remover um usuário da lista
  const removerUsuario = (index) => {
    const novosUsuarios = usuarios.filter((_, i) => i !== index);
    setUsuarios(novosUsuarios);

    // Se o usuário que está sendo removido era o que estava em edição, limpa o formulário
    if (editIndex === index) {
      setNome("");
      setSobrenome("");
      setIdade("");
      setEditIndex(null);
    }
  };

  // Filtra a lista de usuários com base no termo de busca
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Determina a cor de fundo da linha da tabela com base na idade
  const corPorIdade = (idade) => {
    if (idade < 18) return "bg-yellow-300";
    if (idade <= 40) return "bg-green-400";
    return "bg-red-400";
  };
  
  // A UI do aplicativo
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center font-sans">
      <div className="container max-w-4xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Cadastro de Usuários</h1>
        
        {/* Formulário de entrada de dados */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            placeholder="Sobrenome"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
          />
          <input
            type="number"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            placeholder="Idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
          />
          <button 
            onClick={adicionarOuEditarUsuario}
            className="w-full md:w-auto p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            {editIndex !== null ? "Atualizar" : "Adicionar"}
          </button>
        </div>
        
        {/* Mensagem de erro */}
        {erro && <p className="text-red-500 text-center mb-4">{erro}</p>}
        
        {/* Campo de busca */}
        <div className="mb-6">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        
        {/* Tabela de usuários */}
        {usuariosFiltrados.length > 0 && (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Nome</th>
                  <th className="py-3 px-6 text-left">Sobrenome</th>
                  <th className="py-3 px-6 text-left">Idade</th>
                  <th className="py-3 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {usuariosFiltrados.map((usuario, index) => (
                  <tr 
                    key={index} 
                    className={`${corPorIdade(usuario.idade)} border-b border-gray-200 hover:bg-gray-100 transition-colors`}
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">{usuario.nome}</td>
                    <td className="py-3 px-6 text-left">{usuario.sobrenome}</td>
                    <td className="py-3 px-6 text-left">{usuario.idade}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        <button 
                          onClick={() => editarUsuario(index)}
                          className="text-white bg-blue-500 px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-600 transition-colors"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => removerUsuario(index)}
                          className="text-white bg-red-500 px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-600 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}