import { useState } from "react";
import AnimacaoCartas from "../components/AnimacaoCartas";
import Opcoes from "../components/Opcoes";
import Login from "../components/Login";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [altoContraste, setAltoContraste] = useState(false);

  function playClickSound() {
    const audio = new Audio("/AudioClickBalatro.mp3");
    audio.volume = volume;
    audio.play();
  }

  return (
    <main className={styles.container}>
      <AnimacaoCartas altoContraste={altoContraste} />

      <section className={styles.content}>
        <div className={styles.caixas}>
          {mostrarOpcoes ? (
            <Opcoes
              onClose={() => setMostrarOpcoes(false)}
              volume={volume}
              setVolume={setVolume}
              playClickSound={playClickSound}
              altoContraste={altoContraste}
              setAltoContraste={setAltoContraste}
            />
          ) : mostrarLogin ? (
            <Login
              onClose={() => setMostrarLogin(false)}
              playClickSound={playClickSound}
            />
          ) : (
            <header className={styles.box}>
              <h1 className={styles.title}>Jogo de Cartas</h1>
            </header>
          )}
        </div>

        {!mostrarLogin && (
          <nav className={styles.buttons} aria-label="Menu principal">
            <button className={styles.btnPrimary}>Jogar</button>
            <button
              className={styles.btnSecondary}
              onClick={() => {
                playClickSound();
                setMostrarOpcoes(true);
                setMostrarLogin(false);
              }}
            >
              Opções
            </button>
          </nav>
        )}

        <aside>
          <button
            className={styles.btnPerfil}
            onClick={() => {
              playClickSound();
              setMostrarOpcoes(false);
              setMostrarLogin(true);
            }}
          >
            <img
              src="/profile.jpg"
              alt="Foto do perfil"
              className={styles.imgPerfil}
            />
            <span className={styles.textPerfil}>Entrar / Registrar</span>
          </button>
        </aside>
      </section>
    </main>
  );
}
