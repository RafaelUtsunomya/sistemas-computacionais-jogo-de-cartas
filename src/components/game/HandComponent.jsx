// src/components/HandComponent.jsx

import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

/**
 * Este componente é "burro". Ele não sabe nada sobre a lógica do jogo.
 * Ele apenas recebe dados (props) e desenha a mão.
 * * Props:
 * - app: A instância PIXI.Application (já pronta)
 * - handData: Array de nomes de texturas a desenhar
 * - selectedIndices: Um Set() com os índices das cartas selecionadas
 * - onCardClick: Função de callback (ex: handleCardClick(index))
 * - spritesRef: A ref do pai (GamePage) que vamos preencher com os sprites
 */
const HandComponent = ({ 
  app, 
  handData, 
  selectedIndices, 
  onCardClick, 
  spritesRef 
}) => {
  
  // Ref local apenas para o container
  const handContainerRef = useRef(null);

  // Efeito 1: Cria/Recria a mão quando os dados mudam
  useEffect(() => {
    if (!app || !app.stage) return; // Segurança

    console.log("HandComponent: Montando a mão...");

    // 1. Cria o container e adiciona-o ao stage
    const handContainer = new PIXI.Container();
    handContainerRef.current = handContainer;
    app.stage.addChild(handContainer);

    // 2. Limpa a ref de sprites do pai
    spritesRef.current = [];
    
    const cardSpacing = 40; 

    // 3. Loop (o mesmo código que tínhamos antes)
    handData.forEach((textureName, index) => {
      const texture = PIXI.Assets.get(textureName);
      if (!texture) {
        console.warn(`Textura não encontrada: ${textureName}`);
        return; 
      }

      const cardSprite = new PIXI.Sprite(texture);
      cardSprite.anchor.set(0.5, 1.0); 

      // O 'isSelected' já não é preciso aqui, 
      // pois o 'GamePage' (pai) é quem sabe

      const CARD_VISIBLE_WIDTH = 56; 
      const CARD_VISIBLE_HEIGHT = 82;
      const PADDING_INFERIOR_ESTIMADO = 10;
      
      cardSprite.hitArea = new PIXI.Rectangle(
        -CARD_VISIBLE_WIDTH / 2, 
        -(CARD_VISIBLE_HEIGHT + PADDING_INFERIOR_ESTIMADO), 
        CARD_VISIBLE_WIDTH, 
        CARD_VISIBLE_HEIGHT 
      );
      cardSprite.x = index * cardSpacing;
      cardSprite.y = 0; // Posição default
      cardSprite.eventMode = 'static'; 
      cardSprite.cursor = 'pointer'; 

      // 4. O clique agora chama a função do Pai
      cardSprite.on('pointertap', () => {
        onCardClick(index); // "Avisa" o GamePage que foi clicado
      });

      handContainer.addChild(cardSprite);
      
      // 5. Preenche a ref do Pai com o sprite
      spritesRef.current.push(cardSprite);
    });
    
    // 6. Lógica de Resize (vive aqui)
    const handleResize = () => {
      if (!app || app._destroyed || !handContainer) return; 

      const handXOffset = -50; // Posição da mão

      const bottomY = (app.screen.height / app.stage.scale.y) - 20;
      const centerX = (app.screen.width / app.stage.scale.x / 2);
      
      handContainer.x = (centerX - (handContainer.width / 2)) + handXOffset;
      handContainer.y = bottomY;
    };

    // Guarda a ref do listener para o 'destroy'
    app.resizeListener = handleResize; 
    app.renderer.on('resize', app.resizeListener);
    handleResize(); // Posiciona

    // 7. Função de Limpeza (do componente)
    return () => {
      console.log("HandComponent: Destruindo a mão...");
      
      if (app && app.renderer && app.resizeListener) {
        app.renderer.off('resize', app.resizeListener);
      }
      if (handContainer) {
        handContainer.destroy({ children: true });
      }
      spritesRef.current = [];
      handContainerRef.current = null;
    };

  // Dependências: Recria a mão SE o app ou os dados da mão mudarem
  }, [app, handData, onCardClick, spritesRef]);


  // Efeito 2: Atualiza a SELEÇÃO (sobe/desce)
  // Roda sempre que 'selectedIndices' muda. É super rápido.
  useEffect(() => {
    // Loop nos sprites que guardámos na ref do pai
    spritesRef.current.forEach((sprite, index) => {
      if (selectedIndices.has(index)) {
        sprite.y = -20; // Sobe
      } else {
        sprite.y = 0;   // Desce
      }
    });
  }, [selectedIndices, spritesRef]); // Dependência: só a seleção

  // Este componente não renderiza HTML, só no Pixi
  return null;
};

export default HandComponent;