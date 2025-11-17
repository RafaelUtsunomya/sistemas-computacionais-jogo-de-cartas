// src/pages/GamePage.jsx

import React, { useState, useEffect, useRef } from 'react';
// --- MUDANÇA 1: Importar o 'api' (Axios), 'authService' e 'useNavigate' ---
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import authService from '../services/authService';
// --- FIM DA MUDANÇA ---

import styles from './GamePage.module.css';
import HandComponent from '../components/game/HandComponent';
import ScoreBox from '../components/game/Scorebox';
import InfoPanel from '../components/game/InfoPanel';
import Opcoes from '../components/Opcoes';
import ComoJogar from '../components/ComoJogar';
import Profile from '../components/Profile';
import ShareButtons from '../components/game/ShareButtons';
import FeedbackModal from '../components/game/FeedbackModal'; // <-- IMPORTE ISSO
import feedbackStyles from '../components/game/Feedback.module.css';


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
const audioSelect = new Audio('/assets/cardSlide1.ogg');
const audioDeselect = new Audio('/assets/cardSlide2.ogg');
const audioButton = new Audio('/assets/button.ogg');
const audioFoil = new Audio('/assets/foil2.ogg');
const audioHighlight = new Audio('/assets/highlight2.ogg');
const audioWin = new Audio('/assets/win.ogg');
const audioNegative = new Audio('/assets/negative.ogg');
const audioDraw = new Audio('/assets/card3.ogg');


const allAudioSources = [
  audioSelect, audioDeselect, audioButton, audioFoil,
  audioHighlight, audioWin, audioNegative, audioDraw
  // Adicione qualquer outro áudio que você tenha
];

// Função auxiliar para tocar o som (evita sobreposição se clicar rápido)
const playAudio = (audioElement) => {
  audioElement.currentTime = 0; // Reinicia o som
  audioElement.play().catch(e => console.error("Erro ao tocar áudio:", e));
};
const playAudioFromStart = (audioElement) => {
  audioElement.currentTime = 0;
  playAudio(audioElement);
};

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
  const [targetScore, setTargetScore] = useState(300);
  const [discardsRemaining, setDiscardsRemaining] = useState(0);
  const [handResult, setHandResult] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [handsRemaining, setHandsRemaining] = useState(4); // Mãos restantes
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatusMessage, setGameStatusMessage] = useState(""); // Ex: "Nível 1" ou "Game Over!"
  const [deckCount, setDeckCount] = useState(44);
  const [isVictory, setIsVictory] = useState(false);
  const [showOpcoes, setShowOpcoes] = useState(false);
  const [showComoJogar, setShowComoJogar] = useState(false);
  const [volume, setVolume] = useState(1);
  const [altoContraste, setAltoContraste] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null); // Guarda os dados da API
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [finalGameTime, setFinalGameTime] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // --- MUDANÇA 2: Inicializar o 'navigate' ---
  const navigate = useNavigate();
useEffect(() => {
    // Atualiza o volume de TODOS os áudios no array
    allAudioSources.forEach(audio => {
      audio.volume = volume;
    });
    
    // Toca um som de "teste" (opcional, mas útil)
    // Evita tocar no carregamento inicial (volume === 1)
    if (volume > 0 && volume < 1) {
      // Toca um som de feedback para o usuário ouvir a mudança
      // Usamos 'audioSelect' como exemplo
      playAudioFromStart(audioSelect);
    }

  }, [volume]);
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
  const handlePlayAgain = () => {
    // A forma mais fácil e garantida de reiniciar o jogo do zero
    // é recarregar a página.
    playAudio(audioButton);
    window.location.reload();
  };
  const handleShowProfile = async () => {
    
    playAudio(audioButton); // Toca o som de clique
    setShowProfile(true);   // Abre o modal imediatamente
    
    // Se já buscamos os dados antes, não busca de novo
    if (profileData) {
      return;
    }
    
    setProfileLoading(true);
    setProfileError(null);
    
    try {
      // Usa a sua instância 'api' (Axios) para fazer a chamada GET
      const response = await api.get('/User/me'); 
      setProfileData(response.data); // Salva os dados no estado
      
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      setProfileError("Não foi possível carregar o perfil.");
      // Você pode usar sua função 'handleApiError(error, "buscar perfil")' aqui
    } finally {
      setProfileLoading(false);
    }
  };

  const handleReturnToMenu = () => {
    // Isso assume que sua página de menu/home está na rota "/"
    playAudio(audioButton);
    navigate('/');
  };
  const handleGameLoad = (gameState) => {
    setGameId(gameState.gameId);
    
    // Traduz as cartas do backend para o formato visual do frontend
    setHand(gameState.hand.map(translateBackendCard));
    
    // Atualiza pontuações e status
    setScore(gameState.currentLevelScore); // Note: O JSON usa 'currentLevelScore'
    setTargetScore(gameState.targetScore);
    setDiscardsRemaining(gameState.discardsRemaining);
    setCurrentLevel(gameState.currentLevel);
    setHandsRemaining(gameState.handsRemaining);
    setDeckCount(gameState.deckCount);
    setIsGameOver(gameState.isGameOver);
    
    // Se o jogo já vier com mensagem (ex: "Nível 1")
    if (gameState.gameStatusMessage) {
      setGameStatusMessage(gameState.gameStatusMessage);
    }

    // Se o jogo recuperado já estiver Game Over (caso raro, mas possível)
    if (gameState.isGameOver) {
        // Define o tempo final se existir
        if (gameState.elapsedGameTimeSeconds) {
            setFinalGameTime(gameState.elapsedGameTimeSeconds);
        }
    }
  };
  const formatTime = (totalSeconds) => {
  if (!totalSeconds || totalSeconds === 0) {
    return "00:00"; // Retorna 00:00 se não houver tempo
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60); 
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};
  // --- MUDANÇA 4: Usar 'api.post' (Axios) e tratar erros ---
  useEffect(() => {
    const initGame = async () => {
      try {
        // --- TENTATIVA 1: RESUMIR JOGO EXISTENTE ---
        console.log("Verificando jogo em andamento...");
        const response = await api.get('/game/resume');
        
        console.log("Jogo encontrado! Restaurando...");
        handleGameLoad(response.data);

      } catch (error) {
        // Se o erro for 404, significa que o usuário NÃO tem jogo ativo.
        // Isso é normal na primeira vez que ele joga.
        if (error.response && error.response.status === 404) {
            
            console.log("Nenhum jogo ativo. Criando novo...");
            
            // --- TENTATIVA 2: CRIAR NOVO JOGO ---
            try {
                const startResponse = await api.post('/game/start');
                handleGameLoad(startResponse.data);
            } catch (startError) {
                handleApiError(startError, "criar novo jogo");
            }

        } else {
            // Se for outro erro (ex: 401 Sem Auth, 500 Erro Servidor)
            handleApiError(error, "verificar jogo existente");
        }
      }
    };

    initGame();
  }, [navigate]); // Adiciona 'navigate' às dependências
const isFirstRender = useRef(true);
const playClickSound = () => {
    playAudio(audioButton); // Usa o 'audioButton' que você já tem
  };
  // --- EFEITO DE "LEVEL UP" ---
  useEffect(() => {
    
    // 1. Se for a primeira renderização (nível 1), não faz nada.
    if (isFirstRender.current) {
      isFirstRender.current = false; // Marca que não é mais a primeira
      return; // Sai do efeito
    }

    // 2. Se não for a primeira, significa que o nível mudou!
    console.log("LEVEL UP! Agendando som highlight2.ogg");

    // 3. Agenda o som para tocar daqui a 1 segundo
    const soundTimer = setTimeout(() => {
      // Usa a função que já existe neste arquivo!
      playAudioFromStart(audioHighlight); 
    }, 0); // 1000ms = 1 segundo
    
    // (Boa prática) Limpa o timer se o componente for desmontado
    return () => {
      clearTimeout(soundTimer);
    };

  }, [currentLevel]);
  
  // Lógica de clique (não mudou)
  const handleCardClick = (cardId) => {
    if (isAnimating) return;
    if (selected.has(cardId)) {
      // A carta JÁ ESTÁ selecionada -> vai DESELECIONAR
      playAudio(audioDeselect);
    } else if (selected.size < 5) {
      // A carta NÃO ESTÁ selecionada -> vai SELECIONAR
      playAudio(audioSelect);
    }
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
    setDeckCount(gameState.deckCount);
    setHand(gameState.hand.map(translateBackendCard));
    setSelected(new Set());
    setIsAnimating(false);
    
    // --- MUDANÇA 2: ATUALIZAR TODOS OS NOVOS ESTADOS VINDOS DA API ---
    setScore(gameState.currentLevelScore); // Mapeia a pontuação do nível
    setTargetScore(gameState.targetScore);
    setDiscardsRemaining(gameState.discardsRemaining);
    setCurrentLevel(gameState.currentLevel);
    setHandsRemaining(gameState.handsRemaining);
    setIsGameOver(gameState.isGameOver);
    if (gameState.isGameOver) {
     // Comparamos a pontuação atual com a meta
     if (gameState.currentLevelScore >= gameState.targetScore) {
       // VITÓRIA
       setIsVictory(true); // <-- Define o estado de vitória
       playAudioFromStart(audioWin);
     } else {
       // DERROTA
       setIsVictory(false); // <-- Garante que não é vitória
       playAudioFromStart(audioNegative);
     }
     setFinalGameTime(gameState.elapsedGameTimeSeconds);
   }
    // Opcional: use a mensagem do backend
    if (gameState.gameStatusMessage) {
      setGameStatusMessage(gameState.gameStatusMessage);
    }
  };

  // --- MUDANÇA 5: Usar 'api.post' (Axios) e tratar erros ---
  const handlePlayHand = async () => {
    if (selected.size === 0 || selected.size > 5 || isAnimating || !gameId) {
      return;
    }
    playAudio(audioButton);
    setIsAnimating(true);
    setTimeout(() => {
      playAudioFromStart(audioFoil);
    }, 500); // 500ms = 0.5s (a duração da sua animação)
    // --- FIM DA ADIÇÃO ---

    // Você também deve ter o setTimeout que limpa a mão
    setTimeout(() => {
      // ... (lógica para remover cartas da mão e setar isAnimating(false)) ...
    }, 500);

    const body = { cardIdsToPlay: Array.from(selected) };

    try {
      const response = await api.post(`/game/${gameId}/play`, body);
      const newGameState = response.data;
      
      // O seu setTimeout de 500ms (para a animação da carta "voando")
      setTimeout(() => {
        
        // --- MUDANÇA 2: Ativar a animação de resultado ---
        // Verifica se a API enviou os dados da mão jogada
        if (newGameState.lastHandPlayed) {
          setHandResult(newGameState.lastHandPlayed); // Ativa o <div>!
          const resultData = {
            handName: newGameState.lastHandPlayed.handName,
            handScore: newGameState.lastHandPlayed.finalScore // Use 'finalScore'
          };
          setHandResult(resultData);
          // Define um timer para limpar a animação e fazê-la sumir
          // O tempo (1500ms) deve ser igual à duração da sua animação CSS "showHandResult"
          setTimeout(() => {
            setHandResult(null); // Desativa o <div>
          }, 1500); 
        }
        // --- FIM DA MUDANÇA 2 ---
        
        // Atualiza o estado do jogo (nova mão, pontuação total, etc.)
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
    playAudio(audioButton);
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
      {showOpcoes && (
        <div className={styles.modalOverlay}>
        <Opcoes
          onClose={() => setShowOpcoes(false)}
          volume={volume}
          setVolume={setVolume}
          altoContraste={altoContraste}
          setAltoContraste={setAltoContraste}
          playClickSound={playClickSound}
          onReturnToMenu={handleReturnToMenu}
        />
      </div>
      )}
      
      {showComoJogar && (
        <div className={styles.modalOverlay}>
          <ComoJogar
            onClose={() => setShowComoJogar(false)}
            playClickSound={playClickSound}
          />
        </div>
      )}
      {handResult && (
        <div className={styles.handResultAnimation}>
          <div className={styles.handResultName}>{handResult.handName}</div>
          <div className={styles.handResultScore}>+{handResult.handScore}</div>
        </div>
      )}
      {showProfile && (
        <div className={styles.modalOverlay}>
          <Profile
            onClose={() => setShowProfile(false)}
            playClickSound={playClickSound}
            profileData={profileData}
            isLoading={profileLoading}
            error={profileError}
          />
        </div>
      )}
      
      {isGameOver && (
        <div className={styles.gameOverOverlay}>
          <div className={styles.gameOverBox}>
            <h1 className={isVictory ? styles.victoryTitle : ''}>Fim de Jogo!</h1>
            <p>{gameStatusMessage}</p>
          {finalGameTime !== null && (
              <p className={styles.finalTimeText}>
                Tempo: {formatTime(finalGameTime)}
              </p>
            )}
            {/* Container para os botões */}
            <ShareButtons 
               score={score} 
               level={currentLevel} 
               gameId={gameId} // O ID do jogo atual
            />
            <div className={styles.gameOverButtons}>
              <button 
                className={styles.gameOverButton} 
                onClick={handlePlayAgain}
              >
                Jogar Novamente
              </button>
              <button 
                // Adicionamos uma classe extra para estilizar o botão de menu
                className={`${styles.gameOverButton} ${styles.menuButton}`}
                onClick={handleReturnToMenu}
              >
                Voltar ao Menu
              </button>
            </div>

          </div>
        </div>
      )}
      {showFeedback && (
        <FeedbackModal 
          onClose={() => setShowFeedback(false)}
          playClickSound={() => playClickSound(audioButton)} // Use sua função de som
        />
      )}
      <button 
        className={feedbackStyles.floatingBtn}
        onClick={() => {
            playClickSound(audioButton);
            setShowFeedback(true);
        }}
        title="Enviar Feedback"
      >
        ?
      </button>
      <ScoreBox 
        score={score} 
        targetScore={targetScore} 
        discardsRemaining={discardsRemaining}
        currentLevel={currentLevel}
        handsRemaining={handsRemaining}
        styles={styles} 
        // 6. PASSE AS NOVAS FUNÇÕES PARA O SCOREBOX
        onShowComoJogar={() => {
          playClickSound();
          setShowComoJogar(true);
        }}
        onShowOpcoes={() => {
          playClickSound();
          setShowOpcoes(true);
        }}
        onShowProfile={handleShowProfile}
      />
    <InfoPanel styles={styles} />
      <HandComponent
        hand={hand}
        selected={selected}
        isAnimating={isAnimating}
        onCardClick={handleCardClick}
        cardSpriteMap={CARD_SPRITE_MAP}
        cardBackTextureName={CARD_BACK_TEXTURE_NAME}
        audioDraw={audioDraw} 
        playAudioFromStart={playAudioFromStart}
        styles={styles}
        
      />

      <div className={styles.deck}>
        <div className={styles.deckCountText}>
          {deckCount}/52
        </div>
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