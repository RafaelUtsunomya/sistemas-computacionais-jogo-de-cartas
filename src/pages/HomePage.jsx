import { useState } from "react";
import AnimacaoCartas from "../components/AnimacaoCartas";
import Opcoes from "../components/Opcoes";
import Registrar from "../components/Registrar";
import Login from "../components/Login"; 
import AdminPanel from "../components/AdminPanel"; // 1. NOVO: Importar o AdminPanel
import { useAuth } from "../context/AuthContext";   // 2. NOVO: Importar o hook de autenticação
import styles from "./HomePage.module.css";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  // 3. NOVO: Pegar o usuário e a função de logout do contexto
  const { user, logout } = useAuth(); 

  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [mostrarRegistrar, setMostrarRegistrar] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false); 
  const [mostrarAdmin, setMostrarAdmin] = useState(false); // 4. NOVO: Estado para o Admin
  const [altoContraste, setAltoContraste] = useState(false);

  function playClickSound() {
    const audio = new Audio("/AudioClickBalatro.mp3");
    audio.volume = volume;
    audio.play();
  }

  // 3. Funções de controle dos modais (Atualizadas)

  function handleCloseModals() {
    playClickSound();
    setMostrarOpcoes(false);
    setMostrarRegistrar(false);
    setMostrarLogin(false);
    setMostrarAdmin(false); // 5. NOVO: Fechar o admin também
  }

  function handleOpenLogin() {
    playClickSound();
    setMostrarOpcoes(false);
    setMostrarRegistrar(false);
    setMostrarAdmin(false); // Garantir que o admin feche
    setMostrarLogin(true);
  }

  function handleSwitchToRegister() {
    playClickSound();
    setMostrarLogin(false);
    setMostrarRegistrar(true);
  }

  function handleSwitchToLogin() {
    playClickSound();
    setMostrarRegistrar(false);
    setMostrarLogin(true);
  }

  function handleOpenOptions() {
    playClickSound();
    setMostrarRegistrar(false);
    setMostrarLogin(false);
    setMostrarAdmin(false); // Garantir que o admin feche
    setMostrarOpcoes(true);
  }

  // 6. NOVO: Função para abrir o painel de admin
  function handleOpenAdmin() {
    playClickSound();
    setMostrarOpcoes(false);
    setMostrarRegistrar(false);
    setMostrarLogin(false);
    setMostrarAdmin(true);
  }

  // 7. NOVO: Função de Logout
  function handleLogout() {
    playClickSound();
    logout();
    handleCloseModals(); // Fecha qualquer modal que esteja aberto
  }

  return (
    <main className={styles.container}>
      <AnimacaoCartas altoContraste={altoContraste} />

      <section className={styles.content}>
        <div className={styles.caixas}>
          {/* 8. MODIFICADO: Lógica de renderização para incluir o AdminPanel */}
          {mostrarOpcoes ? (
            <Opcoes
              onClose={handleCloseModals}
              volume={volume}
              setVolume={setVolume}
              playClickSound={playClickSound}
              altoContraste={altoContraste}
              setAltoContraste={setAltoContraste}
            />
          ) : mostrarAdmin ? ( // NOVO
            <AdminPanel
              onClose={handleCloseModals}
              playClickSound={playClickSound}
            />
          ) : mostrarLogin ? ( 
            <Login
              onClose={handleCloseModals}
              playClickSound={playClickSound}
              onSwitchToRegister={handleSwitchToRegister}
            />
          ) : mostrarRegistrar ? (
            <Registrar
              onClose={handleCloseModals}
              playClickSound={playClickSound}
              onSwitchToLogin={handleSwitchToLogin}
            />
          ) : (
            <header className={styles.box}>
              <h1 className={styles.title}>Jogo de Cartas</h1>
            </header>
          )}
        </div>

        {/* 9. MODIFICADO: Esconder botões se QUALQUER modal estiver aberto */}
        {!mostrarRegistrar && !mostrarLogin && !mostrarOpcoes && !mostrarAdmin && (
          <nav className={styles.buttons} aria-label="Menu principal">
            <button 
              className={styles.btnPrimary} 
              onClick={() => {
                playClickSound();
                navigate('/game');
             }}
            >Jogar
            </button>
            <button
              className={styles.btnSecondary}
              onClick={handleOpenOptions}
            >
              Opções
            </button>
            
            {/* ✨✨✨ A MÁGICA ESTÁ AQUI ✨✨✨
              Este botão só aparece se 'user' existir E 'user.role' for 'Admin'
            */}
            {user && user.role === 'Admin' && (
              <button
                className={styles.btnSecondary} // Pode criar um estilo novo (ex: btnAdmin)
                style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }} // Exemplo de destaque
                onClick={handleOpenAdmin}
              >
                Gerenciar Perfis
              </button>
            )}
          </nav>
        )}

        <aside>
          {/* 10. MODIFICADO: Botão de Perfil agora faz Login OU Logout */}
          <button
            className={styles.btnPerfil}
            // Se o usuário existir, o clique faz Logout. Senão, abre o Login.
            onClick={user ? handleLogout : handleOpenLogin} 
          >
            <img
              src="/profile.jpg"
              alt="Foto do perfil"
              className={styles.imgPerfil}
            />
            {/* O texto agora é dinâmico */}
            <span className={styles.textPerfil}>
              {user ? `${user.email} (Sair)` : "Entrar / Registrar"}
            </span>
          </button>
        </aside>
      </section>
    </main>
  );
}