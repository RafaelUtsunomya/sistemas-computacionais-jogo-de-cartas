  // src/components/Registrar.jsx (ou onde ele estiver)

  import { useState } from "react";
  import { motion } from "framer-motion";
  import styles from "./Registrar.module.css";
  import authService from "../services/authService"; // 1. Importar o serviço

  export default function Registrar({ 
    onClose, 
    playClickSound, 
    onSwitchToLogin // 2. Nova prop para trocar de modal
  }) {
    const [erros, setErros] = useState({});
    const [apiError, setApiError] = useState(""); // 3. Estado para erro do backend
    const [isLoading, setIsLoading] = useState(false); // 4. Estado de carregamento

    async function handleSubmit(e) { // 5. Marcar como async
      e.preventDefault();
      setErros({}); // Limpa erros de validação
      setApiError(""); // Limpa erros de API
      
      const nome = e.target.nome.value.trim();
      const email = e.target.email.value.trim();
      const senha = e.target.senha.value;
      const novosErros = {};

      // Sua validação de frontend (ótimo!)
      if (nome.length < 3) {
        novosErros.nome = "O nome deve ter pelo menos 3 caracteres.";
      }
      if (senha.length < 6) {
        novosErros.senha = "A senha deve ter pelo menos 6 caracteres.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        novosErros.email = "Email inválido.";
      }

      setErros(novosErros);

      // 6. Se a validação do frontend passar, chama o backend
      if (Object.keys(novosErros).length === 0) {
        setIsLoading(true);
        try {
          await authService.register({ nome, email, senha });
          
          // Sucesso!
          playClickSound();
          alert("Registro realizado com sucesso! Faça o login para continuar.");
          onSwitchToLogin(); // Troca para o modal de login

        } catch (error) {
          // Erro vindo do backend (ex: "Email já em uso")
          setApiError(error.toString()); 
        } finally {
          setIsLoading(false);
        }
      }
    }

    return (
      <div className={styles.box}>
        <h2>Registrar</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* ... seu input 'nome' ... */}
          <div className={styles.formGroup}>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              className={styles.input}
              autoComplete="name"
            />
            {erros.nome && <span className={styles.erro}>{erros.nome}</span>}
          </div>

          {/* ... seu input 'email' ... */}
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              autoComplete="email"
            />
            {erros.email && <span className={styles.erro}>{erros.email}</span>}
          </div>

          {/* ... seu input 'senha' ... */}
          <div className={styles.formGroup}>
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              className={styles.input}
              autoComplete="new-password"
            />
            {erros.senha && <span className={styles.erro}>{erros.senha}</span>}
          </div>

          {/* 7. Exibir erro da API */}
          {apiError && <span className={styles.erroApi}>{apiError}</span>}

          <button 
            type="submit" 
            className={styles.btnRegistrar}
            disabled={isLoading} // 8. Desabilitar enquanto carrega
          >
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        {/* 9. Link para trocar para o Login */}
        <button
          className={styles.linkButton} // Crie um estilo para isso
          onClick={() => {
            playClickSound();
            onSwitchToLogin();
          }}
        >
          Já tenho uma conta
        </button>

        <button
          className={styles.close}
          onClick={() => {
            playClickSound();
            onClose();
          }}
        >
          Fechar
        </button>
      </div>
    );
  }