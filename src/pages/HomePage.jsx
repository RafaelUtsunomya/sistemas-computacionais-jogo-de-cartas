import { useState } from "react";
import AnimacaoCartas from "../components/AnimacaoCartas";
import Opcoes from "../components/Opcoes";
import Registrar from "../components/Registrar";
import Login from "../components/Login"; 
import AdminPanel from "../components/AdminPanel"; 
import Profile from "../components/Profile"; // 1. NOVO: Importar o Profile
import { useAuth } from "../context/AuthContext"; 
import api from '../services/api'; // 2. NOVO: Importar o 'api' (Axios)
import styles from "./HomePage.module.css";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [mostrarRegistrar, setMostrarRegistrar] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false); 
  const [mostrarAdmin, setMostrarAdmin] = useState(false); 
  const [altoContraste, setAltoContraste] = useState(false);

  // 3. NOVO: Estados para o Profile
  const [mostrarProfile, setMostrarProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Em HomePage.jsx

  function playClickSound() {
    const audio = new Audio("/AudioClickBalatro.mp3");
    audio.volume = volume;
    
    // .play() retorna uma "Promise". Devemos sempre ter um .catch()
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Isso evita que o erro "quebre" seu app e só avisa no console.
        console.warn("Erro (ignorado) ao tocar áudio de clique:", error);
      });
    }
  }

  // 4. MODIFICADO: Funções de controle dos modais 

  function handleCloseModals() {
    
    setMostrarOpcoes(false);
    setMostrarRegistrar(false);
    setMostrarLogin(false);
    setMostrarAdmin(false);
    setMostrarProfile(false); // NOVO
playClickSound();
  }

  function handleOpenLogin() {
    playClickSound();
    setMostrarOpcoes(false);
    setMostrarRegistrar(false);
    setMostrarAdmin(false); 
    setMostrarProfile(false); // NOVO
    setMostrarLogin(true);
  }

  function handleSwitchToRegister() {
    // (Esta função não abre, só troca, não precisa mudar)
    playClickSound();
    setMostrarLogin(false);
    setMostrarRegistrar(true);
  }

  function handleSwitchToLogin() {
    // (Esta função não abre, só troca, não precisa mudar)
    playClickSound();
    setMostrarRegistrar(false);
    setMostrarLogin(true);
  }

  function handleOpenOptions() {
    playClickSound();
    setMostrarRegistrar(false);
    setMostrarLogin(false);
    setMostrarAdmin(false); 
    setMostrarProfile(false); // NOVO
    setMostrarOpcoes(true);
  }

  function handleOpenAdmin() {
    playClickSound();
    setMostrarOpcoes(false);
    setMostrarRegistrar(false);
    setMostrarLogin(false);
    setMostrarProfile(false); // NOVO
    setMostrarAdmin(true);
  }

  // 5. NOVO: Função para abrir o Perfil (busca dados da API)
  async function handleOpenProfile() {
    playClickSound();
    setMostrarOpcoes(false);
    setMostrarRegistrar(false);
    setMostrarLogin(false);
    setMostrarAdmin(false);
    setMostrarProfile(true); // Abre este modal

    // Se já temos os dados, não busca de novo
    if (profileData) return; 

    setProfileLoading(true);
    setProfileError(null);
    try {
      const response = await api.get('/User/me');
      setProfileData(response.data);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      setProfileError("Erro ao carregar perfil.");
    }
    setProfileLoading(false);
  }

  function handleLogout() {
    playClickSound();
    logout();
    handleCloseModals(); 
  }

  return (
    <main className={styles.container}>
      <AnimacaoCartas altoContraste={altoContraste} />

      <section className={styles.content}>
        <div className={styles.caixas}>
          {/* 6. MODIFICADO: Lógica de renderização para incluir o Profile */}
          {mostrarOpcoes ? (
            <Opcoes
              onClose={handleCloseModals}
              volume={volume}
              setVolume={setVolume}
              playClickSound={playClickSound}
              altoContraste={altoContraste}
              setAltoContraste={setAltoContraste}
              onReturnToMenu={handleLogout} // Adiciona a função de Sair
            />
          ) : mostrarAdmin ? ( 
            <AdminPanel
              onClose={handleCloseModals}
              playClickSound={playClickSound}
            />
          ) : mostrarProfile ? ( // NOVO
            <Profile
              onClose={handleCloseModals}
              playClickSound={playClickSound}
              profileData={profileData}
              isLoading={profileLoading}
          error={profileError}
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
              <h1 className={styles.title}>Poker Hands</h1>
            </header>
          )}
        </div>

        {/* 7. MODIFICADO: Esconder botões se QUALQUER modal estiver aberto */}
        {!mostrarRegistrar && !mostrarLogin && !mostrarOpcoes && !mostrarAdmin && !mostrarProfile && (
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

            {/* 8. NOVO: Botão Perfil (só aparece se 'user' estiver logado) */}
            {user && (
              <button
                className={styles.btnSecondary}
                onClick={handleOpenProfile}
              >
                Perfil
              </button>
            )}
            
            {/* Botão Admin (só aparece se 'user' for Admin) */}
            {user && user.role === 'Admin' && (
              <button
                className={styles.btnSecondary} 
                style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }} 
                onClick={handleOpenAdmin}
              >
                Gerenciar Perfis
              </button>
            )}
          </nav>
        )}

        <aside>
          {/* (Este botão de Login/Logout permanece o mesmo) */}
          <button
            className={styles.btnPerfil}
            onClick={user ? handleLogout : handleOpenLogin} 
          >
            <img
              src="/profile.jpg"
              alt="Foto do perfil"
              className={styles.imgPerfil}
            />
            <span className={styles.textPerfil}>
              {user ? `${user.email} (Sair)` : "Entrar / Registrar"}
            </span>
          </button>
        </aside>
      </section>
    </main>
  );
}