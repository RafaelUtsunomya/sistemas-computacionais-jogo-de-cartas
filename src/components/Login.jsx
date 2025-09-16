  import { useState } from "react";
  import { motion } from "framer-motion";
  import styles from "./Login.module.css";

  export default function Login({ onClose, playClickSound }) {
    const [erros, setErros] = useState({});

    function handleSubmit(e) {
      e.preventDefault();
      const nome = e.target.nome.value.trim();
      const email = e.target.email.value.trim();
      const senha = e.target.senha.value;
      const novosErros = {};

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

      if (Object.keys(novosErros).length === 0) {
        // Se passou nas validações, pode prosseguir
        alert("Registro realizado!");
        // ...lógica de registro...
      }
    }

    return (
      <div className={styles.box}>
        <h2>Registrar</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
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
          <button type="submit" className={styles.btnRegistrar}>
            Registrar
          </button>
        </form>
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