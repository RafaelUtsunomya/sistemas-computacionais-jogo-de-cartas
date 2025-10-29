import React, { useState } from 'react';
import userService from '../services/userService';
// Vamos reutilizar o mesmo CSS do Login/Registrar
import styles from './Login.module.css';

// Este componente é o formulário de edição
export default function EditUserModal({
  user,           // O usuário que estamos editando
  onClose,        // Função para voltar para a lista
  onUserUpdated,  // Função para atualizar o usuário na lista principal
  playClickSound,
}) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    role: user.role,
    // Nota: Não mexemos com senha aqui para simplificar
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Chama o serviço de update
      // O backend espera { username, email, role } no corpo da requisição
      const updatedUser = await userService.updateUser(user.id, formData);

      // 2. Avisa o AdminPanel que o usuário foi atualizado
      onUserUpdated(updatedUser);
      playClickSound();
      onClose(); // Fecha o modal de edição
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Reutilizamos o .box para manter o estilo
    <div className={styles.box}>
      <h2>Editar Usuário: {user.username}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username" style={{ color: 'white', fontSize: '0.9rem' }}>Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" style={{ color: 'white', fontSize: '0.9rem' }}>Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="role" style={{ color: 'white', fontSize: '0.9rem' }}>Papel (Role)</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={styles.input} // Reutilizando estilo do input
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {error && <span className={styles.erroApi}>{error}</span>}

        <button
          type="submit"
          className={styles.btnRegistrar}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>

      {/* Botão para voltar para a lista */}
      <button
        className={styles.linkButton}
        onClick={() => {
          playClickSound();
          onClose();
        }}
      >
        Cancelar (Voltar para a lista)
      </button>
    </div>
  );
}
