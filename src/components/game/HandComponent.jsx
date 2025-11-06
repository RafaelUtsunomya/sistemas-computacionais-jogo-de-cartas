// src/components/HandComponent.jsx



import React from 'react';



// Recebe o novo prop 'cardBackTextureName'

const HandComponent = ({

  hand,

  selected,

  isAnimating,

  onCardClick,

  cardSpriteMap,

  cardBackTextureName, // <-- NOVO PROP

  styles

}) => {

 

  // Pega as coordenadas do verso da carta

  const backSpriteInfo = cardSpriteMap[cardBackTextureName] || { x: 0, y: 0 };

 

  return (

    <div className={styles.handContainer}>

       

      {hand.map((card, index) => {

        // Pega as coordenadas da FRENTE da carta

        const frontSpriteInfo = cardSpriteMap[card.textureName] || { x: 0, y: 0 };

        const isSelected = selected.has(card.id);



        return (

          // --- ESTRUTURA 3D FLIP ---



          // 1. O POSICIONADOR ('leque' e animação de "voar")

          //    É este que tem o 'key' e o 'onClick'

          <div

            key={card.id}

            className={`${styles.card} ${isSelected ? styles.selected : ''}`}

            onClick={() => onCardClick(card.id)}

            style={{

              // Adiciona a animação de "Jogar" (quando clica 'Jogar Mão')

              ...(isAnimating && isSelected && {

                animation: `${styles.playAnimation} 0.5s forwards`

              }),

              // Adiciona a animação de "Comprar" (no início)

              // com um atraso para cada carta

              animationDelay: `${index * 100}ms`,

            }}

          >

            {/* 2. O "VIRADOR" (controla a rotação 3D) */}

            <div

              className={styles.cardInner}

              style={{

                // Adiciona a animação de "Virar" (no início)

                animationDelay: `${index * 100}ms`,

              }}

            >



              {/* 3. O VERSO DA CARTA (face de trás) */}

              <div className={`${styles.cardFace} ${styles.cardBack}`}>

                <div

                  className={styles.cardSprite}

                  style={{

                    backgroundPosition: `-${backSpriteInfo.x}px -${backSpriteInfo.y}px`,

                  }}

                />

              </div>



              {/* 4. A FRENTE DA CARTA (face da frente) */}

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