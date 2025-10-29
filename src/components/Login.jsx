import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // 1. Importar o useAuth
// import authService from "../services/authService"; // 2. REMOVER o authService daqui
import styles from "./Login.module.css"; 

export default function Login({ 
  onClose, 
  playClickSound, 
  onSwitchToRegister
}) {
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // 3. Pegar a função de login do CONTEXTO

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    
    const email = e.target.email.value.trim();
    const senha = e.target.senha.value;

    if (!email || !senha) {
      setApiError("Email e senha são obrigatórios.");
      return;
    }

    setIsLoading(true);
    try {
      // 4. USAR a função de login do contexto
      // Esta função vai chamar o authService E TAMBÉM o setUser
      await login(email, senha); 
      
      // Sucesso! O contexto foi atualizado e a HomePage vai re-renderizar
      playClickSound();
      onClose(); 

    } catch (error) {
      // O contexto relança o erro, então podemos pegá-lo aqui
      setApiError(error.toString()); 
    } finally {
      setIsLoading(false);
    }
  }

  // O resto do seu JSX (formulário, botões, etc.) continua igual
  return (
    <div className={styles.box}>
      <h2>Login</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
            autoComplete="email"
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            className={styles.input}
            autoComplete="current-password"
          />
        </div>

        {apiError && <span className={styles.erroApi}>{apiError}</span>}

        <button 
          type="submit" 
          className={styles.btnRegistrar}
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <button
        className={styles.linkButton} 
        onClick={() => {
          playClickSound();
          onSwitchToRegister();
        }}
      >
        Não tenho uma conta
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

