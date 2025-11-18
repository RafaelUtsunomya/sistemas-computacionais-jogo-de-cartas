import React from 'react';

// 1. Adicionar os novos props: onShowComoJogar, onShowOpcoes
export default function ScoreBox({ 
  score, 
  targetScore, 
  currentLevel, 
  handsRemaining, 
  discardsRemaining, 
  styles,
  onShowComoJogar, // <-- NOVO PROP
  onShowOpcoes,
  onShowProfile     // <-- NOVO PROP
}) {
  
  // 2. Manter a sua função de formatação
  const formatScore = (num) => {
    if (typeof num !== 'number' || isNaN(num)) {
      return '0';
    }
    return num.toLocaleString('pt-PT');
  };

  // 3. Nova estrutura JSX com 3 seções
  return (
    <div className={styles.scoreBox}>
      
      {/* --- Seção 1: Pontuação (Pontos e Meta) --- */}
      <div className={styles.scoreSection}>
        <div className={styles.scoreLabel}>PONTOS</div>
        <div className={styles.scoreValue}>
          {formatScore(score)}
          {/* Mostra a meta com uma fonte menor ao lado */}
          <span className={styles.targetValue}> / {formatScore(targetScore)}</span>
        </div>
      </div>

      {/* --- Seção 2: Informações (Nível, Mãos, Descartes) --- */}
      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          <span>NÍVEL:</span>
          <span className={styles.infoValue}>{currentLevel}</span>
        </div>
        <div className={styles.infoItem}>
          <span>MÃOS:</span>
          <span className={styles.infoValue}>{handsRemaining}</span>
        </div>
        <div className={styles.infoItem}>
          <span>DESCARTES:</span>
          <span className={styles.infoValue}>{discardsRemaining}</span>
        </div>
      </div>

      {/* --- Seção 3: Botões (Novidade) --- */}
      <div className={styles.buttonSection}>
        <button 
          className={styles.scoreBoxButton} 
          onClick={onShowComoJogar}
        >
          COMO JOGAR
        </button>
        <button 
          className={styles.scoreBoxButton} 
          onClick={onShowOpcoes}
        >
          OPÇÕES
        </button>
        <button 
          className={styles.scoreBoxButton} 
          onClick={onShowProfile}
        >
          PERFIL
        </button>
      </div>

    </div>
  );
};