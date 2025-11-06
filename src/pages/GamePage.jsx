// src/pages/GamePage.jsx

import React, { useState, useEffect } from 'react';
// --- MUDANÇA 1: Importar o 'api' (Axios), 'authService' e 'useNavigate' ---
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import authService from '../services/authService';
// --- FIM DA MUDANÇA ---

import styles from './GamePage.module.css';
import HandComponent from '../components/game/HandComponent';
import ScoreBox from '../components/game/Scorebox';

// 1. O MAPA COMPLETO (não mudou)
const CARD_SPRITE_MAP = {
  'CardsPixelart/10OfClubs.png': { x: 0, y: 0 },
  'CardsPixelart/10OfDiamonds.png': { x: 0, y: 100 },
  'CardsPixelart/10OfHearts.png': { x: 0, y: 200 },
  'CardsPixelart/10OfSpades.png': { x: 0, y: 300 },
  'CardsPixelart/2OfClubs.png': { x: 0, y: 400 },
  'CardsPixelart/2OfDiamonds.png': { x: 0, y: 500 },
  'CardsPixelart/2OfHearts.png': { x: 0, y: 600 },
  'CardsPixelart/2OfSpades.png': { x: 0, y: 700 },
  'CardsPixelart/3OfClubs.png': { x: 0, y: 800 },
  'CardsPixelart/3OfDiamonds.png': { x: 0, y: 900 },
  'CardsPixelart/3OfHearts.png': { x: 0, y: 1000 },
  'CardsPixelart/3OfSpades.png': { x: 0, y: 1100 },
  'CardsPixelart/4OfClubs.png': { x: 0, y: 1200 },
  'CardsPixelart/4OfDiamonds.png': { x: 0, y: 1300 },
  'CardsPixelart/4OfHearts.png': { x: 0, y: 1400 },
  'CardsPixelart/4OfSpades.png': { x: 0, y: 1500 },
  'CardsPixelart/5OfClubs.png': { x: 0, y: 1600 },
  'CardsPixelart/5OfDiamonds.png': { x: 0, y: 1700 },
  'CardsPixelart/5OfHearts.png': { x: 0, y: 1800 },
  'CardsPixelart/5OfSpades.png': { x: 0, y: 1900 },
  'CardsPixelart/6OfClubs.png': { x: 100, y: 0 },
  'CardsPixelart/6OfDiamonds.png': { x: 200, y: 0 },
  'CardsPixelart/6OfHearts.png': { x: 300, y: 0 },
  'CardsPixelart/6OfSpades.png': { x: 400, y: 0 },
  'CardsPixelart/7OfClubs.png': { x: 500, y: 0 },
  'CardsPixelart/7OfDiamonds.png': { x: 600, y: 0 },
  'CardsPixelart/7OfHearts.png': { x: 700, y: 0 },
  'CardsPixelart/7OfSpades.png': { x: 800, y: 0 },
  'CardsPixelart/8OfClubs.png': { x: 900, y: 0 },
  'CardsPixelart/8OfDiamonds.png': { x: 1000, y: 0 },
  'CardsPixelart/8OfHearts.png': { x: 1100, y: 0 },
  'CardsPixelart/8OfSpades.png': { x: 1200, y: 0 },
  'CardsPixelart/9OfClubs.png': { x: 1300, y: 0 },
  'CardsPixelart/9OfDiamonds.png': { x: 1400, y: 0 },
  'CardsPixelart/9OfHearts.png': { x: 1500, y: 0 },
  'CardsPixelart/9OfSpades.png': { x: 1600, y: 0 },
  'CardsPixelart/AceOfClubs.png': { x: 1700, y: 0 },
  'CardsPixelart/AceOfDiamonds.png': { x: 1800, y: 0 },
  'CardsPixelart/AceOfHearts.png': { x: 1900, y: 0 },
  'CardsPixelart/AceOfSpades.png': { x: 100, y: 100 },
  'CardsPixelart/CardBack.png': { x: 100, y: 200 },
  'CardsPixelart/JackOfClubs.png': { x: 100, y: 300 },
  'CardsPixelart/JackOfDiamonds.png': { x: 100, y: 400 },
  'CardsPixelart/JackOfHearts.png': { x: 100, y: 500 },
  'CardsPixelart/JackOfSpades.png': { x: 100, y: 600 },
  'CardsPixelart/KingOfClubs.png': { x: 100, y: 700 },
  'CardsPixelart/KingOfDiamonds.png': { x: 100, y: 800 },
  'CardsPixelart/KingOfHearts.png': { x: 100, y: 900 },
  'CardsPixelart/KingOfSpades.png': { x: 100, y: 1000 },
  'CardsPixelart/QueenOfClubs.png': { x: 100, y: 1100 },
  'CardsPixelart/QueenOfDiamonds.png': { x: 100, y: 1200 },
  'CardsPixelart/QueenOfHearts.png': { x: 100, y: 1300 },
  'CardsPixelart/QueenOfSpades.png': { x: 100, y: 1400 },
};

// O nome da textura do verso da carta
const CARD_BACK_TEXTURE_NAME = 'CardsPixelart/CardBack.png';

// --- Mapeamento para "Tradução" --- (não mudou)
const rankMap = {
  'A': 'Ace', 'K': 'King', 'Q': 'Queen', 'J': 'Jack', '10': '10', '9': '9',
  '8': '8', '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2',
};
const suitMap = {
  'Hearts': 'Hearts', 'Spades': 'Spades', 'Clubs': 'Clubs', 'Diamonds': 'Diamonds',
};
const translateBackendCard = (backendCard) => {
  const rank = rankMap[backendCard.rank];
  const suit = suitMap[backendCard.suit];
  if (!rank || !suit) {
    console.warn(`Não foi possível mapear a carta: ${backendCard.id}`);
    return { id: backendCard.id, textureName: CARD_BACK_TEXTURE_NAME }; 
  }
  const textureName = `CardsPixelart/${rank}Of${suit}.png`;
  if (!CARD_SPRITE_MAP[textureName]) {
    console.warn(`Nome de textura não encontrado no MAPA: ${textureName}`);
    return { id: backendCard.id, textureName: CARD_BACK_TEXTURE_NAME };
  }
  return {
    id: backendCard.id,
    textureName: textureName,
  };
};
// --- Fim do Mapeamento ---

const GamePage = () => {
  const [gameId, setGameId] = useState(null);
  const [hand, setHand] = useState([]); 
  const [selected, setSelected] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(1000);
  const [discardsRemaining, setDiscardsRemaining] = useState(0);
  
  // --- MUDANÇA 2: Inicializar o 'navigate' ---
  const navigate = useNavigate();

  // --- MUDANÇA 3: Tratar Erros de API (incluindo 401) ---
  const handleApiError = (error, operation = "operação") => {
    console.error(`Erro ao ${operation}:`, error);
    if (error.response) {
      if (error.response.status === 401) {
        // Token inválido ou expirado
        console.error("Não autorizado (401). A limpar token e redirecionar para login...");
        authService.logout(); // Limpa o token inválido
        navigate('/login'); // Redireciona
      } else {
        // Outro erro do backend (400, 404, 500)
        const errorMessage = error.response.data?.message || error.response.data || 'Erro do servidor';
        console.error(`Erro do servidor (${error.response.status}): ${errorMessage}`);
        // TODO: Mostrar este 'errorMessage' para o utilizador
      }
    } else if (error.request) {
      console.error("Erro de rede: O servidor não respondeu.");
    } else {
      console.error("Erro:", error.message);
    }
  };

  // --- MUDANÇA 4: Usar 'api.post' (Axios) e tratar erros ---
  useEffect(() => {
    const startGame = async () => {
      try {
        // USA O AXIOS (que já tem o header de Auth)
        const response = await api.post('/game/start');
        const gameState = response.data; // O Axios já faz o .json()
        
        setGameId(gameState.gameId);
        setHand(gameState.hand.map(translateBackendCard));
        setScore(gameState.totalScore);
        setDiscardsRemaining(gameState.discardsRemaining);
        
      } catch (error) {
        handleApiError(error, "iniciar o jogo");
      }
    };
    startGame();
  }, [navigate]); // Adiciona 'navigate' às dependências

  // Lógica de clique (não mudou)
  const handleCardClick = (cardId) => {
    if (isAnimating) return;
    setSelected(prevSelected => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(cardId)) {
        newSelection.delete(cardId);
      } else if (newSelection.size < 5) {
        newSelection.add(cardId);
      }
      return newSelection;
    });
  };

  // Função genérica para atualizar o estado (não mudou)
  const updateStateFromResponse = (gameState) => {
    setHand(gameState.hand.map(translateBackendCard));
    setScore(gameState.totalScore);
    setDiscardsRemaining(gameState.discardsRemaining);
    setSelected(new Set());
    setIsAnimating(false);
  };

  // --- MUDANÇA 5: Usar 'api.post' (Axios) e tratar erros ---
  const handlePlayHand = async () => {
    if (selected.size === 0 || selected.size > 5 || isAnimating || !gameId) {
      return;
    }
    setIsAnimating(true);

    const body = { cardIdsToPlay: Array.from(selected) };

    try {
      // USA O AXIOS
      const response = await api.post(`/game/${gameId}/play`, body);
      const newGameState = response.data;
      
      setTimeout(() => {
        updateStateFromResponse(newGameState);
      }, 500);

    } catch (error) {
      handleApiError(error, "jogar a mão");
      setIsAnimating(false); // Reativa os botões em caso de erro
    }
  };

  // --- MUDANÇA 6: Usar 'api.post' (Axios) e tratar erros ---
  const handleDiscardHand = async () => {
    if (selected.size === 0 || isAnimating || !gameId || discardsRemaining <= 0) {
      return;
    }
    setIsAnimating(true); 

    const body = { cardIdsToDiscard: Array.from(selected) };

    try {
      // USA O AXIOS
      const response = await api.post(`/game/${gameId}/discard`, body);
      const newGameState = response.data;
      
      setTimeout(() => {
        updateStateFromResponse(newGameState);
      }, 500);

    } catch (error) {
      handleApiError(error, "descartar a mão");
      setIsAnimating(false); 
    }
  };

  // --- Lógica do Botão (não mudou) ---
  const selectedCount = selected.size;
  let buttonText = "Jogar Mão";
  let isButtonDisabled = true;
  if (isAnimating) {
    buttonText = "Jogando...";
    isButtonDisabled = true;
  } else if (selectedCount > 5) {
    buttonText = `Máximo de 5 (${selectedCount})`;
    isButtonDisabled = true;
  } else if (selectedCount > 0) {
    buttonText = `Jogar ${selectedCount} Carta(s)`;
    isButtonDisabled = false;
  } else {
    buttonText = "Jogar Mão";
    isButtonDisabled = true;
  }
  let isDiscardDisabled = true;
  if (isAnimating) {
    isDiscardDisabled = true;
  } else if (discardsRemaining <= 0) {
    isDiscardDisabled = true;
  } else if (selectedCount === 0) {
    isDiscardDisabled = true;
  } else {
    isDiscardDisabled = false;
  }

  // --- RENDER (não mudou) ---
  return (
    <div className={styles.gameContainer}>
      
      <ScoreBox 
        score={score} 
        targetScore={targetScore} 
        discardsRemaining={discardsRemaining}
        styles={styles} 
      />

      <HandComponent
        hand={hand}
        selected={selected}
        isAnimating={isAnimating}
        onCardClick={handleCardClick}
        cardSpriteMap={CARD_SPRITE_MAP}
        cardBackTextureName={CARD_BACK_TEXTURE_NAME}
        styles={styles}
      />

      <div className={styles.deck}>
        <div
          className={styles.cardSprite}
          style={{
            backgroundPosition: `-${CARD_SPRITE_MAP[CARD_BACK_TEXTURE_NAME].x}px -${CARD_SPRITE_MAP[CARD_BACK_TEXTURE_NAME].y}px`,
          }}
        />
      </div>

      <button
        className={styles.playButton}
        disabled={isButtonDisabled}
        onClick={handlePlayHand}
      >
        {buttonText}
      </button>

      <button
        className={styles.discardButton}
        disabled={isDiscardDisabled}
        onClick={handleDiscardHand}
      >
        Descartar ({discardsRemaining})
      </button>

    </div>
  );
};

export default GamePage;