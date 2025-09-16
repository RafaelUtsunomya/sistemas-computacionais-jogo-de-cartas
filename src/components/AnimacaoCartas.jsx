import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./AnimacaoCartas.module.css";

const cartas = [
  { src: "/AceOfSpades.png", alt: "AceOfSpades" },
  { src: "/AceOfHearts.png", alt: "AceOfHearts" },
  { src: "/AceOfDiamonds.png", alt: "AceOfDiamonds" },
  { src: "/AceOfClubs.png", alt: "AceOfClubs" },
];
const cartasContraste = [
  { src: "/AceOfSpadesHighContrast.png", alt: "AceOfSpades Alto Contraste" },
  { src: "/AceOfHeartsHighContrast.png", alt: "AceOfHearts Alto Contraste" },
  { src: "/AceOfDiamondsHighContrast.png", alt: "AceOfDiamonds Alto Contraste" },
  { src: "/AceOfClubsHighContrast.png", alt: "AceOfClubs Alto Contraste" },
];

function gerarDirecao() {
  const direcao = Math.floor(Math.random() * 4);

  // Profundidade simulada
  const profundidade = Math.random(); // 0 (longe) a 1 (perto)
  const scale = 0.6 + profundidade * 0.8; // 0.6 a 1.4
  const opacity = 0.8 + profundidade * 0.2; // 0.8 a 1
  const blur = 3 - profundidade * 3; // 3px (longe) a 1px (perto)
  const zIndex = Math.round(profundidade * 100);

  // Sorteia velocidade e ângulo de rotação
  const rotSpeed = 180 + Math.random() * 180;
  const rotStart = Math.random() * 360;
  const rotEnd = rotStart + rotSpeed;

  let from = {}, to = {};

  switch (direcao) {
    case 0: {
      const x = Math.random() * 90;
      from = { x: `${x}vw`, y: "-20vh", scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotStart };
      to = { x: `${x}vw`, y: "120vh", scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotEnd };
      break;
    }
    case 1: {
      const x = Math.random() * 90;
      from = { x: `${x}vw`, y: "120vh", scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotStart };
      to = { x: `${x}vw`, y: "-20vh", scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotEnd };
      break;
    }
    case 2: {
      const y = Math.random() * 90;
      from = { x: "-20vw", y: `${y}vh`, scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotStart };
      to = { x: "120vw", y: `${y}vh`, scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotEnd };
      break;
    }
    case 3: {
      const y = Math.random() * 90;
      from = { x: "120vw", y: `${y}vh`, scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotStart };
      to = { x: "-20vw", y: `${y}vh`, scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotEnd };
      break;
    }
    default:
      from = { x: "-20vw", y: "50vh", scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotStart };
      to = { x: "120vw", y: "50vh", scale, opacity, filter: `blur(${blur}px)`, zIndex, rotate: rotEnd };
  }

  // Cartas maiores passam mais rápido, menores mais devagar
  const duration = 4 + (1 - (scale - 0.7) / 0.8) * 3;

  return { from, to, duration };
}

function CartaAnimada({ carta }) {
  const [caminho, setCaminho] = useState(gerarDirecao());

  const handleFim = () => {
    setCaminho(gerarDirecao());
  };

  return (
    <motion.img
      src={carta.src}
      alt={carta.alt}
      className={styles.card}
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
    />
  );
}
export default function CartasAnimadas({ altoContraste}) {
  const [cartasAtivas, setCartasAtivas] = useState([]);

  useEffect(() => {
    const cartasBase = altoContraste ? cartasContraste : cartas;
    setCartasAtivas(
      Array.from({ length: 10 }, (_, i) => ({
        ...cartasBase[i % cartasBase.length],
        id: i,
      }))
    );
  }, [altoContraste]);

  return (
    <div className={styles.background}>
      {cartasAtivas.map((carta) => (
        <CartaAnimada key={carta.id} carta={carta} />
      ))}
    </div>
  );
}