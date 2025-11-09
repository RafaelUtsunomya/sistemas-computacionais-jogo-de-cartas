import React from 'react';

// Recebe 'styles' como prop para acessar as classes CSS
const InfoPanel = ({ styles }) => {
  return (
    // O container principal do painel
    <div className={styles.infoPanel}>
      
      {/* Título da primeira seção */}
      <h3 className={styles.infoPanelTitle}>Valor Cartas</h3>
      
      {/* Lista de valores das cartas */}
      <div className={styles.infoPanelSection}>
        <p>2 = <span className={styles.blueText}>+2</span></p>
        <p>3 = <span className={styles.blueText}>+3</span></p>
        <p>4 = <span className={styles.blueText}>+4</span></p>
        <p>5 = <span className={styles.blueText}>+5</span></p>
        <p>6 = <span className={styles.blueText}>+6</span></p>
        <p>7 = <span className={styles.blueText}>+7</span></p>
        <p>8 = <span className={styles.blueText}>+8</span></p>
        <p>9 = <span className={styles.blueText}>+9</span></p>
        <p>10 = <span className={styles.blueText}>+10</span></p>
        <p>J = <span className={styles.blueText}>+10</span></p>
        <p>Q = <span className={styles.blueText}>+10</span></p>
        <p>K = <span className={styles.blueText}>+10</span></p>
        <p>A = <span className={styles.blueText}>+11</span></p>
      </div>

      {/* Título da segunda seção */}
      <h3 className={styles.infoPanelTitle}>Tabela de Mão</h3>
      
      {/* Lista de mãos e pontos com as cores */}
      <div className={styles.infoPanelSection}>
        <p>High Card = <span className={styles.blueText}>5</span> <span className={styles.redText}>x 1</span></p>
        <p>Pair = <span className={styles.blueText}>10</span> <span className={styles.redText}>x 2</span></p>
        <p>Two Pair = <span className={styles.blueText}>20</span> <span className={styles.redText}>x 2</span></p>
        <p>Three of a Kind = <span className={styles.blueText}>30</span> <span className={styles.redText}>x 3</span></p>
        <p>Straight = <span className={styles.blueText}>30</span> <span className={styles.redText}>x 4</span></p>
        <p>Flush = <span className={styles.blueText}>35</span> <span className={styles.redText}>x 4</span></p>
        <p>Full House = <span className={styles.blueText}>40</span> <span className={styles.redText}>x 4</span></p>
        <p>Four of a kind = <span className={styles.blueText}>60</span> <span className={styles.redText}>x 7</span></p>
        <p>Straight Flush = <span className={styles.blueText}>100</span> <span className={styles.redText}>x 8</span></p>

      </div>
    </div>
  );
};

export default InfoPanel;