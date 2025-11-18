// src/components/game/ShareButtons.jsx
import React from 'react';
import styles from './ShareButtons.module.css'; // (Crie um CSS simples depois)

const ShareButtons = ({ score, level, gameId }) => {
  
  // O texto que vai aparecer no post
  const shareText = `Acabei de fazer ${score} pontos no Nível ${level} no Poker Hands! Tente me superar!`;

  // 1. Método Nativo (Celulares)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Poker Hands - Meu Resultado',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Erro ao compartilhar ou cancelado:', error);
      }
    } else {
      alert("Seu navegador não suporta compartilhamento nativo.");
    }
  };

  // 2. Links diretos (Desktop/Fallback)
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText) }`;

  return (
    <div className={styles.shareContainer}>
      <p>Compartilhar Resultado:</p>
      
      
      {/* Botão WhatsApp */}
      <button 
        onClick={() => window.open(whatsappUrl, '_blank')} 
        className={`${styles.btnShare} ${styles.whatsapp}`}
      >
        WhatsApp
      </button>
    </div>
  );
};

export default ShareButtons;