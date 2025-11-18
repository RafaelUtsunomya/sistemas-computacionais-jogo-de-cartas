import React, { useState } from 'react';
import api from '../../services/api'; // Seu axios configurado
import styles from './Feedback.module.css';

// Mapeamento dos tipos conforme seu backend (Enum)
const FEEDBACK_TYPES = [
  { id: 0, label: 'Bug ' },
  { id: 1, label: 'Sugestão ' },
  { id: 2, label: 'Opinião' },
  { id: 3, label: 'Outro ' }
];

export default function FeedbackModal({ onClose, playClickSound }) {
  const [type, setType] = useState(1); // Padrão: Sugestão
  const [rating, setRating] = useState(5); // Padrão: 5 estrelas
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // Para feedback visual (sucesso/erro)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (playClickSound) playClickSound();

    if (!message.trim()) {
      setStatusMessage("Por favor, escreva uma mensagem.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Enviando...");

    try {
      // Envia para o seu endpoint
      await api.post('/feedback', {
        message: message,
        type: parseInt(type), // Garante que é inteiro
        rating: parseInt(rating)
      });

      setStatusMessage("Enviado com sucesso! Obrigado.");
      
      // Fecha o modal automaticamente após 1.5s
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      setStatusMessage("Erro ao enviar. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <form className={styles.box} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Feedback</h2>

        {/* Seleção de Tipo */}
        <div>
          <label className={styles.label}>Tipo:</label>
          <select 
            className={styles.select}
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            {FEEDBACK_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Avaliação (Estrelas) */}
        <div>
          <label className={styles.label} style={{textAlign: 'center'}}>Avaliação:</label>
          <div className={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.starBtn} ${star <= rating ? styles.active : ''}`}
                onClick={() => {
                    if(playClickSound) playClickSound();
                    setRating(star);
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Mensagem */}
        <div>
          <label className={styles.label}>Mensagem:</label>
          <textarea
            className={styles.textarea}
            placeholder="Conte-me sobre sua experiência com o jogo!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
        </div>

        {/* Status de Envio */}
        {statusMessage && (
            <p style={{fontSize: '0.8rem', color: '#4CAF50', textAlign: 'center'}}>
                {statusMessage}
            </p>
        )}

        {/* Botões */}
        <div className={styles.buttonGroup}>
          <button 
            type="button" 
            className={styles.btnCancel} 
            onClick={() => {
                if(playClickSound) playClickSound();
                onClose();
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={styles.btnSend}
            disabled={isSubmitting}
          >
            {isSubmitting ? '...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
}