import { motion } from "framer-motion";
import styles from "./Opcoes.module.css";

// 1. Adicione 'onReturnToMenu' aos props
export default function Opcoes({ 
  onClose, 
  volume, 
  setVolume, 
  altoContraste, 
  setAltoContraste, 
  playClickSound,
  onReturnToMenu 
}) {
  return (
    <motion.section
      className={styles.box}
      initial={{ y: "100vh", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
    >
      <h2>Opções</h2>

      {/* Controle de volume */}
      <label className={styles.control}>
        Volume:
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className={styles.slider}
          style={{ "--percent": `${volume * 100}%` }}
        />
      </label>

      {/* Toggle para cartas em alto contraste */}
      <label className={styles.toggle}>
        Alto Contraste
        <input
          type="checkbox"
          checked={altoContraste}
          onChange={(e) => setAltoContraste(e.target.checked)}
        />
        <span className={styles.sliderToggle}></span>
      </label>

      {/* 2. Crie um container para os botões (melhor para o layout) */}
      <div className={styles.buttonContainer}>
        
        {/* 3. Adicione o novo botão "Voltar ao Menu" */}
        <button
          className={`${styles.close} ${styles.returnButton}`} // Usa o estilo base 'close' + um novo 'returnButton'
          onClick={() => {
            onReturnToMenu(); // 1. Chame a lógica primeiro
            playClickSound(); // Chama a nova função
          }}
        >
          Voltar ao Menu
        </button>

        {/* Botão fechar (agora dentro do container) */}
        <button
          className={styles.close}
          onClick={() => {
            onClose();        // 1. Chame a lógica primeiro
            playClickSound();
          }}
        >
          Fechar
        </button>
      </div>

    </motion.section>
  );
}