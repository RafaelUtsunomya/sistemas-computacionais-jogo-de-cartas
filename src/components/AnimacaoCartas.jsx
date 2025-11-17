import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./AnimacaoCartas.module.css";

// 1. SEU MAPA COMPLETO (Mantido igual)
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

// Função de gerar direção
function gerarDirecao() {
  const direcao = Math.floor(Math.random() * 4);
  const profundidade = Math.random(); 
  const scale = 1.0 + profundidade * 0.8; 
  const opacity = 0.8 + profundidade * 0.2; 
  const blur = 3 - profundidade * 3; 
  const zIndex = Math.round(profundidade * 100);

  const rotSpeed = 180 + Math.random() * 180;
  const rotStart = Math.random() * 360;
  const rotEnd = rotStart + rotSpeed;

  let from = {}, to = {};

  switch (direcao) {
    case 0: // Cima -> Baixo
      const x = Math.random() * 90;
      from = { x: `${x}vw`, y: "-20vh", scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotStart };
      to = { x: `${x}vw`, y: "120vh", scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotEnd };
      break;
    case 1: // Baixo -> Cima
      const x2 = Math.random() * 90;
      from = { x: `${x2}vw`, y: "120vh", scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotStart };
      to = { x: `${x2}vw`, y: "-20vh", scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotEnd };
      break;
    case 2: // Esquerda -> Direita
      const y = Math.random() * 90;
      from = { x: "-20vw", y: `${y}vh`, scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotStart };
      to = { x: "120vw", y: `${y}vh`, scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotEnd };
      break;
    case 3: // Direita -> Esquerda
      const y2 = Math.random() * 90;
      from = { x: "120vw", y: `${y2}vh`, scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotStart };
      to = { x: "-20vw", y: `${y2}vh`, scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotEnd };
      break;
    default:
      from = { x: 0, y: 0 }; to = { x: 0, y: 0 };
  }
  
  const duration = 4 + (1 - (scale - 0.7) / 0.8) * 3;
  return { from, to, duration };
}

// Subcomponente de Carta Única (Sem props de alto contraste)
function CartaAnimada({ spriteKey }) {
  const [caminho, setCaminho] = useState(gerarDirecao());
  const coords = CARD_SPRITE_MAP[spriteKey];

  const handleFim = () => {
    setCaminho(gerarDirecao());
  };

  return (
    <motion.div
      className={styles.cardContainer} 
      style={{
        zIndex: caminho.from.zIndex,
        filter: caminho.from.filter,
      }}
      initial={caminho.from}
      animate={caminho.to}
      transition={{
        duration: caminho.duration,
        ease: "linear",
      }}
      onAnimationComplete={handleFim}
    >
      <div 
        className={styles.cardSprite}
        style={{
            // Fixado para usar sempre o baralho padrão
            backgroundImage: 'url(/assets/baralho.png)',
            backgroundPosition: `-${coords.x}px -${coords.y}px`
        }}
      />
    </motion.div>
  );
}

// Componente Principal (Removemos o prop 'altoContraste')
export default function AnimacaoCartas() {
  const [cartasAtivas, setCartasAtivas] = useState([]);

  // Pega todas as chaves do mapa, removendo o verso da carta
  const allCardKeys = useMemo(() => {
    return Object.keys(CARD_SPRITE_MAP).filter(key => !key.includes('CardBack'));
  }, []);

  useEffect(() => {
    // Cria 15 cartas aleatórias para a animação
    const novasCartas = Array.from({ length: 15 }, (_, i) => {
      const randomKey = allCardKeys[Math.floor(Math.random() * allCardKeys.length)];
      return {
        id: i,
        spriteKey: randomKey
      };
    });
    setCartasAtivas(novasCartas);
  }, [allCardKeys]);

  return (
    <div className={styles.background}>
      {cartasAtivas.map((carta) => (
        <CartaAnimada 
            key={carta.id} 
            spriteKey={carta.spriteKey} 
        />
      ))}
    </div>
  );
}