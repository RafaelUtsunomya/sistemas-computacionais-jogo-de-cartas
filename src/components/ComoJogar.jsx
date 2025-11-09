// src/components/game/ComoJogar.jsx

import { motion } from "framer-motion";
// Vamos criar um CSS para ele, pode ser uma cópia do Opcoes.module.css
import styles from "./ComoJogar.module.css"; 

export default function ComoJogar({ onClose, playClickSound }) {
  return (
    <motion.section
      className={styles.box}
      initial={{ y: "100vh", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
    >
      <h2>Como Jogar</h2>
      
      {/* Você pode usar a classe 'content' para estilizar o texto */}
      <div className={styles.content}>
        <p>
          O objetivo é atingir a pontuação alvo em cada nível. Complete o nível 8 para ganhar o jogo.
        </p>
        <p>
          - Jogar Mão: Selecione até 5 cartas e clique em "Jogar Mão" para pontuar. Cartas que não contribuem com a mão não pontuam.
        </p>
        <p>
          - Descartar: Selecione cartas que não quer e clique em "Descartar". Você tem um número limitado de descartes.
        </p>
        <p>
          - Mãos: Você tem um número limitado de mãos para jogar por nível. Se zerar, você perde.
        </p>
      </div>

      {/* Botão fechar */}
      <button
        className={styles.close}
        onClick={() => {
          playClickSound();
          onClose();
        }}
      >
        Fechar
      </button>
    </motion.section>
  );
}