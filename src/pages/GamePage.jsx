// src/pages/GamePage.jsx

// 1. IMPORTAMOS O useState
import React, { useRef, useEffect, useState } from 'react'; 
import * as PIXI from 'pixi.js';
import styles from './GamePage.module.css';
import { TextureStyle } from "pixi.js";
// 2. IMPORTAMOS O NOVO COMPONENTE
import HandComponent from '../components/game/HandComponent'; 

// Esta constante fica aqui
const MOCK_HAND_DATA = [
  'CardsPixelart/AceOfSpades.png',
  'CardsPixelart/CardBack.png',
  'CardsPixelart/AceOfSpades.png',
  'CardsPixelart/CardBack.png',
  'CardsPixelart/AceOfSpades.png',
  'CardsPixelart/CardBack.png',
  'CardsPixelart/AceOfSpades.png',
  'CardsPixelart/CardBack.png'
];

const GamePage = () => {
  const pixiContainer = useRef(null);
  const appRef = useRef(null);
  const handSpritesRef = useRef([]); // O filho (HandComponent) vai preencher isto

  // --- MUDANÇA PRINCIPAL: Usamos o 'state' para gerir o ciclo de vida ---
  const [appReady, setAppReady] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [handData, setHandData] = useState([]); // O 'estado' da mão
  const [selectedIndices, setSelectedIndices] = useState(new Set()); // O 'estado' da seleção
  
  // --- ADIÇÃO: Novo estado para "cooldown" do botão ---
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    console.log("useEffect: Montando GamePage e iniciando Pixi...");

    let isMounted = true; 
    let app; 

    const initPixi = async () => {
      if (!pixiContainer.current) {
        return; 
      }

      try {
        app = new PIXI.Application();
        
        await app.init({
          resizeTo: window,
          backgroundAlpha: 0,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          antialias: true,
        });

        if (!isMounted || !pixiContainer.current) {
          app.destroy(true, { children: true });
          return;
        }
        
        appRef.current = app;
        pixiContainer.current.appendChild(app.canvas);
        app.stage.scale.set(3);
       TextureStyle.defaultOptions.scaleMode = 'nearest';

        await PIXI.Assets.load({
          alias: 'baralho', 
          src: '/assets/baralho.json', 
          data: { scaleMode: 'nearest' } 
        });

        if (!isMounted) return;

        // 3. Em vez de criar a mão, apenas definimos os 'states'
        console.log("Pixi pronto, assets carregados. A renderizar HandComponent...");
        setHandData(MOCK_HAND_DATA);
        setAssetsLoaded(true);
        setAppReady(true);
  
      } catch (error) {
        console.error('Falha na inicialização do PixiJS:', error);
        if (app) {
          app.destroy(true, { children: true });
          appRef.current = null;
        }
      }
    };
    initPixi();

    // A função de limpeza agora também limpa os 'states'
    return () => {
      console.log("useEffect: Limpando GamePage (destroy)...");
      isMounted = false; 

      const appToDestroy = appRef.current;
      
      if (appToDestroy && !appToDestroy._destroyed) {
        if (appToDestroy.resizeListener) {
          appToDestroy.renderer.off('resize', appToDestroy.resizeListener);
        }
        if (appToDestroy.ticker) {
          appToDestroy.ticker.stop();
        }
        appToDestroy.destroy(true, {
          children: true,
          texture: true,
          baseTexture: true,
        });
      }

      // Limpa tudo
      appRef.current = null;
      handSpritesRef.current = [];
      setAppReady(false);
      setAssetsLoaded(false);
      setHandData([]);
      setSelectedIndices(new Set());
      setIsAnimating(false); // Garante que o estado de animação é limpo
    };
  }, []);

  // --- LÓGICA DE JOGO (agora no React) ---

  // Esta função é passada para o HandComponent
  const handleCardClick = (index) => {
    // Não permite clicar em cartas enquanto a animação decorre
    if (isAnimating) return; 

    setSelectedIndices(prevSelected => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(index)) {
        newSelection.delete(index);
      } else {
        newSelection.add(index);
      }
      return newSelection;
    });
  };

  // Esta é a função do botão 'onClick'
  const handlePlayHand = () => {
    const app = appRef.current;
    
    // --- MUDANÇA: Verifica se já está a animar ---
    if (!app || isAnimating) return;

    // Filtra os sprites com base no 'state' do React
    const spritesToPlay = handSpritesRef.current.filter((sprite, index) => 
      selectedIndices.has(index)
    );

    const selectedCount = spritesToPlay.length;
    if (selectedCount === 0 || selectedCount > 5) return;

    const handContainer = handSpritesRef.current[0]?.parent; // Pega o container
    if (!handContainer) return; // Segurança

    // --- MUDANÇA: Desativa o botão IMEDIATAMENTE ---
    setIsAnimating(true);

    const onTick = (ticker) => {
      let allDone = true;
      for (const sprite of spritesToPlay) {
        sprite.y -= ticker.deltaTime * 5; 
        sprite.alpha -= 0.02 * ticker.deltaTime;

        if (sprite.alpha > 0) {
          allDone = false; 
        } else {
          sprite.alpha = 0;
        }
      }

      if (allDone) {
        app.ticker.remove(onTick); 

        const newHandData = handData.filter((card, index) => 
          !selectedIndices.has(index)
        );

        setHandData(newHandData);
        setSelectedIndices(new Set());
        
        // --- MUDANÇA: Re-ativa o botão QUANDO a animação termina ---
        setIsAnimating(false);
      }
    };

    app.ticker.add(onTick);
  };

  // --- LÓGICA DO BOTÃO (agora no React) ---
  const selectedCount = selectedIndices.size;
  let buttonText = "Jogar Mão";
  let isButtonDisabled = true; // Começa desativado por defeito

  // --- MUDANÇA: Adiciona 'isAnimating' à lógica ---
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
  
  // --- RENDER ---
  return (
    <div ref={pixiContainer} className={styles.gameContainer}>
      
      {appReady && assetsLoaded && (
        <HandComponent 
          app={appRef.current}
          handData={handData}
          selectedIndices={selectedIndices}
          onCardClick={handleCardClick}
          spritesRef={handSpritesRef} 
        />
      )}

      {/* O botão agora usa a nova lógica 'isButtonDisabled' */}
      <button 
        className={styles.playButton}
        disabled={isButtonDisabled}
        onClick={handlePlayHand}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default GamePage;