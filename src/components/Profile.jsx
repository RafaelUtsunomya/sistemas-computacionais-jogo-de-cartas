// src/components/game/Profile.jsx

import { motion } from "framer-motion";
import styles from "./Opcoes.module.css"; // Reutilize o mesmo CSS!

// --- INÍCIO DA CORREÇÃO ---

// Função helper para formatar o tempo de Segundos para MM:SS
const formatTime = (totalSeconds) => {
  if (!totalSeconds || totalSeconds === 0) {
    return "N/A"; // Retorna "Não Aplicável" se for 0 ou nulo
  }
  
  // 1. Calcula os minutos
  const minutes = Math.floor(totalSeconds / 60);
  
  // 2. Calcula os segundos restantes
  const seconds = Math.floor(totalSeconds % 60); // Usamos Math.floor para garantir inteiros

  // 3. Formata para ter sempre dois dígitos (ex: "05" em vez de "5")
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // 4. Retorna no formato MM:SS
  return `${formattedMinutes}:${formattedSeconds}`;
};
// --- FIM DA CORREÇÃO ---


export default function Profile({ 
  onClose, 
  playClickSound, 
  profileData, 
  isLoading, 
  error 
}) {

  // Função para decidir o que renderizar dentro da caixa
  const renderContent = () => {
    if (isLoading) {
      return <p className={styles.loadingText}>Carregando...</p>;
    }
    
    if (error) {
      return <p className={styles.errorText}>{error}</p>;
    }
    
    if (!profileData) {
      return <p className={styles.loadingText}>Nenhum dado encontrado.</p>;
    }

    // Se tiver dados, mostra o perfil
    return (
      <div className={styles.profileContent}>
        <div className={styles.profileItem}>
          <span>Usuário:</span>
          <span className={styles.profileValue}>{profileData.username}</span>
        </div>
        <div className={styles.profileItem}>
          <span>Melhor Mão:</span>
          <span className={styles.profileValue}>{profileData.bestHand || "Nenhuma"}</span>
        </div>
        <div className={styles.profileItem}>
          <span>Pontuação Máx:</span>
          <span className={styles.profileValue}>{profileData.highestHandScore}</span>
        </div>
        <div className={styles.profileItem}>
          <span>Melhor Tempo:</span>
          {/* Esta linha agora chama a função corrigida */}
          <span className={styles.profileValue}>{formatTime(profileData.bestTime)}</span>
        </div>
      </div>
    );
  };

  return (
    <motion.section
      className={styles.box}
      initial={{ y: "100vh", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
    >
      <h2>Perfil</h2>
      
      {renderContent()}

      <button
        className={styles.close}
        style={{ marginTop: '2rem' }}
        onClick={() => {
          playClickSound();
          onClose();
        }}
      >
        Fechar
      </button>
    </motion.section>
  );
}