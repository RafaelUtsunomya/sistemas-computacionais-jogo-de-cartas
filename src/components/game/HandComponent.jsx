import React, { useEffect, useRef, useMemo } from 'react'; // <-- Verifique se tem os 3

// O áudio de "comprar" (draw) pertence a este componente




const HandComponent = ({
  hand,
  selected,
  isAnimating,
  onCardClick,
  cardSpriteMap,
  cardBackTextureName,
  styles,
  audioDraw,
  playAudioFromStart
  // Nota: Removi 'animationType' e 'audioFoil', 
  // já que você os moveu para o GamePage (corretamente!)
}) => {
  
  const backSpriteInfo = cardSpriteMap[cardBackTextureName] || { x: 0, y: 0 };

  // --- INÍCIO DA CORREÇÃO ---

  // 1. Criamos o Set de IDs da mão ATUAL (para comparações)
  const currentHandIdSet = useMemo(() => new Set(hand.map(c => c.id)), [hand]);

  // 2. Criamos uma ref para o Set de IDs ANTERIOR
  // Começa vazia.
  const prevHandIdSetRef = useRef(new Set()); 
  
  // 3. Criamos uma ref para o estado ANTERIOR de isAnimating
  const prevIsAnimatingRef = useRef(isAnimating);


  // Efeito principal para tocar os sons
  useEffect(() => {
    
    // Pega os valores da renderização *anterior*
    const prevIds = prevHandIdSetRef.current;
    const prevAnimating = prevIsAnimatingRef.current;

    // --- CONDIÇÃO 1: MÃO INICIAL (quando o jogo começa) ---
    // Se a mão anterior estava vazia (size 0) E
    // a mão atual tem cartas (> 0) E
    // não estamos a animar (a jogar/descartar)
    if (prevIds.size === 0 && currentHandIdSet.size > 0 && !isAnimating) {
      
      console.log("[HandComponent] Mão Inicial detectada. Tocando sons...");
      
      hand.forEach((card, index) => {
        // Toca som para CADA carta, pois todas são novas
        console.log(`-- Carta: ${card.id} no índice ${index}. Tocando som...`);
        setTimeout(() => {
      playAudioFromStart(audioDraw); // <-- ESTA LINHA MUDOU
    }, index * 100);
      });
    }
    
    // --- CONDIÇÃO 2: MÃOS SEGUINTES (após jogar/descartar) ---
    // Se a animação acabou de MUDAR de 'true' para 'false'
    else if (prevAnimating === true && isAnimating === false) {
      
      console.log("[HandComponent] Animação terminou. Verificando novas cartas...");

      hand.forEach((card, index) => {
        // Se a carta atual NÃO ESTAVA no set anterior... é nova.
        if (!prevIds.has(card.id)) {
          console.log(`-- Nova carta: ${card.id} no índice ${index}. Tocando som...`);
          
          // Toca o som APENAS para a carta nova, sincronizado com o seu 'index'
          setTimeout(() => {
            playAudioFromStart(audioDraw);
          }, index * 100);
        }
      });
    }

    // SEMPRE atualiza as refs no final, para preparar a *próxima* renderização
    prevHandIdSetRef.current = currentHandIdSet;
    prevIsAnimatingRef.current = isAnimating;

  }, [hand, isAnimating, currentHandIdSet, audioDraw, playAudioFromStart]); // Depende dos valores ATUAIS
  
  // --- FIM DA CORREÇÃO ---


  return (
    <div className={styles.handContainer}>
      
      {hand.map((card, index) => {
        // O seu JSX aqui (não precisa de mudar nada)
        // ...
        const frontSpriteInfo = cardSpriteMap[card.textureName] || { x: 0, y: 0 };
        const isSelected = selected.has(card.id);

        return (
          // 1. O POSICIONADOR
          <div
            key={card.id}
            className={`${styles.card} ${isSelected ? styles.selected : ''}`}
            onClick={() => onCardClick(card.id)}
            style={
              (isAnimating && isSelected) ? {
                // Estilos de "jogar"
                animationName: styles.playAnimation,
                animationDuration: '0.5s',
                animationFillMode: 'forwards',
                animationDelay: '0s', 
              } : {
                // Estilos de "deal" (sincronizados com o som)
                animationDelay: `${index * 100}ms`,
              }
            }
          >
            {/* 2. O "VIRADOR" */}
            <div
              className={styles.cardInner}
              style={
                (isAnimating && isSelected) ? {
                  // Estilos de "jogar"
                  animationPlayState: 'paused',
                  animationDelay: '0s', 
                } : {
                  // Estilos de "deal" (sincronizados com o som)
                  animationDelay: `${index * 100}ms`,
                }
              }
            >

              {/* 3. O VERSO DA CARTA */}
              <div className={`${styles.cardFace} ${styles.cardBack}`}>
                <div
                  className={styles.cardSprite}
                  style={{
                    backgroundPosition: `-${backSpriteInfo.x}px -${backSpriteInfo.y}px`,
                  }}
                />
              </div>

              {/* 4. A FRENTE DA CARTA */}
              <div className={`${styles.cardFace} ${styles.cardFront}`}>
                <div
                  className={styles.cardSprite}
                  style={{
                    backgroundPosition: `-${frontSpriteInfo.x}px -${frontSpriteInfo.y}px`,
                  }}
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HandComponent;