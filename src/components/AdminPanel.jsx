import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
// Vamos reutilizar o mesmo CSS do Login/Registrar
import styles from './AdminPanel.module.css';
// 1. Importar o novo componente de edição
import EditUserModal from './EditUserModal';

export default function AdminPanel({ onClose, playClickSound }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 2. Novo estado para controlar quem estamos editando
  const [editingUser, setEditingUser] = useState(null);

  // Busca os usuários quando o modal é aberto
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []); // O array vazio [] garante que isso rode só uma vez

  const handleDelete = async (userId) => {
    // Confirmação antes de deletar
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userService.deleteUser(userId);
        // Remove o usuário da lista na tela, sem precisar recarregar
        setUsers(users.filter((user) => user.id !== userId));
        playClickSound();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // 3. Nova função para atualizar o usuário na lista
  const handleUserUpdated = (updatedUser) => {
    // Atualiza a lista de 'users' com os novos dados
    setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    setEditingUser(null); // Fecha o modal de edição
  };

  // ---------------- RENDERIZAÇÃO ----------------

  if (loading) {
    return (
      <div className={styles.box} style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'white' }}>Carregando Usuários...</h2>
      </div>
    );
  }

  // 4. Se 'editingUser' tiver um usuário, renderiza o modal de edição
  if (editingUser) {
    return (
      <EditUserModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUserUpdated={handleUserUpdated}
        playClickSound={playClickSound}
      />
    );
  }

  // 5. Caso contrário, renderiza a lista de usuários (o estado padrão)
  return (
    <div className={styles.box} style={{ color: 'white' }}>
      <h2>Painel do Administrador</h2>
      {error && <span className={styles.erroApi}>{error}</span>}

      {/* Tabela de Usuários */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #7e22ce' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Usuário</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Papel</th>
            <th style={{ padding: '8px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #2a004a' }}>
              <td style={{ padding: '8px' }}>{user.id}</td>
              <td style={{ padding: '8px' }}>{user.username}</td>
              <td style={{ padding: '8px' }}>{user.email}</td>
              <td style={{ padding: '8px' }}>{user.role}</td>
              <td style={{ padding: '8px', display: 'flex', gap: '5px' }}>
                <button
                  className={styles.linkButton}
                  style={{ fontSize: '0.8rem', padding: '2px 4px' }}
                  onClick={() => setEditingUser(user)} // 6. Define quem estamos editando
                >
                  Editar
                </button>
                <button
                  className={styles.linkButton}
                  style={{ color: '#ff4d4f', fontSize: '0.8rem', padding: '2px 4px' }}
                  onClick={() => handleDelete(user.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botão de Fechar o Painel de Admin (Voltar para o Jogo) */}
      <button
        className={styles.close}
        style={{ marginTop: '1.5rem' }}
        onClick={() => {
          playClickSound();
          onClose();
        }}
      >
        Fechar Painel
      </button>
    </div>
  );
}

