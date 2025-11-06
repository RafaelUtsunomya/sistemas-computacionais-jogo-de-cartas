import React from 'react';

// Um componente "burro" simples que apenas exibe os pontos
const ScoreBox = ({ score, targetScore, styles }) => {
  
  // Formata os números para terem "pontos" (ex: 1.500)
  const formatScore = (num) => num.toLocaleString('pt-PT');

  return (
    <div className={styles.scoreBox}>
      <div className={styles.scoreLabel}>PONTOS</div>
      <div className={styles.scoreValue}>
        {formatScore(score)}
      </div>
      <div className={styles.scoreTarget}>
        Meta: {formatScore(targetScore)}
      </div>
    </div>
  );
};

export default ScoreBox;