import * as PIXI from 'pixi.js';
// A linha 'import { TextureStyle }' foi removida pois não é mais necessária
// import { TextureStyle } from "pixi.js"; 

export class PixiGame {
  app = null;
  container = null;
  carta = null;
  verso = null;
  resizeHandler = null; 

  constructor(containerElement) {
    this.container = containerElement;
  }

  async init() {
    const app = new PIXI.Application();
    this.app = app; 

    await app.init({
      resizeTo: window,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
    });

    this.container.appendChild(app.canvas);
    
    app.stage.scale.set(3);
    
    // --- LINHA PROBLEMÁTICA REMOVIDA ---
    // TextureStyle.defaultOptions.scaleMode = 'nearest'; // <-- REMOVIDA

    try {
      // Esta é a forma correta e segura de definir o scaleMode
      await PIXI.Assets.load({
        alias: 'baralho',
        src: '/assets/baralho.json',
        data: { scaleMode: 'nearest' } // <-- ISTO FAZ O TRABALHO
      });

      const texturaCartaTeste = PIXI.Assets.get(
        'CardsPixelart/AceOfSpades.png'
      );
      const texturaVerso = PIXI.Assets.get('CardsPixelart/CardBack.png');

      if (!texturaCartaTeste || !texturaVerso) {
        console.error(
          'Erro: Não foi possível encontrar as texturas no spritesheet.'
        );
        return;
      }
    
      const carta = new PIXI.Sprite(texturaCartaTeste);
      carta.anchor.set(0.5);
      carta.x = app.screen.width / app.stage.scale.x / 2;
      carta.y = app.screen.height / app.stage.scale.y / 2;
      app.stage.addChild(carta);
      this.carta = carta; 

      const verso = new PIXI.Sprite(texturaVerso);
      verso.anchor.set(0.5);
      verso.x = (app.screen.width / app.stage.scale.x / 2) + 120;
      verso.y = app.screen.height / app.stage.scale.y / 2;
      app.stage.addChild(verso);
      this.verso = verso; 

      const handleResize = () => {
        if (!this.app) return; // Checagem de segurança
        this.carta.x = this.app.screen.width / this.app.stage.scale.x / 2;
        this.carta.y = this.app.screen.height / this.app.stage.scale.y / 2;
        this.verso.x = (this.app.screen.width / this.app.stage.scale.x / 2) + 120;
        this.verso.y = this.app.screen.height / this.app.stage.scale.y / 2;
      };

      this.resizeHandler = handleResize;
      app.renderer.on('resize', this.resizeHandler);

    } catch (error) {
      console.error('Falha ao carregar assets do PixiJS:', error);
    }
  }

  destroy() {
    const app = this.app;
    if (app) {
      if (this.resizeHandler) {
        app.renderer.off('resize', this.resizeHandler);
      }

      app.destroy(true, {
        children: true,
        texture: true,
        baseTexture: true,
      });
      this.app = null;
    }
  }
}