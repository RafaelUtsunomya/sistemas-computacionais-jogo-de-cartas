import * as PIXI from 'pixi.js';

// Esta é uma Classe que "estende" um Container do Pixi.
// Pense nisto como um "Componente" do Pixi.
// Ele agrupa toda a lógica de como uma carta deve parecer e se comportar.

export class CardSprite extends PIXI.Container {
  
  constructor(cartaData) { // cartaData vem do estado do React (ex: { id: 'A_de_Copas', ... })
    super(); // Chama o construtor do PIXI.Container

    this.cartaData = cartaData;

    // --- Crie os visuais aqui ---
    
    // ✨✨✨ CORREÇÃO 1 (Graphics) ✨✨✨
    // No Pixi v8, a ordem importa: defina o estilo ANTES de desenhar.
    const fundo = new PIXI.Graphics();
    fundo.fill(0xFFFFFF);     // 1. Definir a cor do preenchimento (branco)
    fundo.rect(0, 0, 100, 150); // 2. Desenhar o retângulo
    fundo.closePath();        // 3. (Boa prática) Fechar o desenho
    
    this.addChild(fundo); // Adiciona o fundo ao container

    // 2. O texto da carta
    const cor = (cartaData.naipe === 'Copas' || cartaData.naipe === 'Ouros') ? 0xFF0000 : 0x000000;
    
    // ✨✨✨ CORREÇÃO 2 (Text) ✨✨✨
    // No Pixi v8, o objeto 'style' deve ser uma instância de PIXI.TextStyle
    const texto = new PIXI.Text({
        text: `${cartaData.valor}\n${cartaData.naipe}`,
        // A sintaxe correta é passar um NOVO TextStyle
        style: new PIXI.TextStyle({ 
            fill: cor,
            fontSize: 20,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 100,
        })
    });
    // ✨✨✨ FIM DA CORREÇÃO 2 ✨✨✨

    texto.x = 50; // Metade da largura (100)
    texto.y = 75; // Metade da altura (150)
    texto.anchor.set(0.5); // Centraliza o texto
    
    this.addChild(texto); // Adiciona o texto ao container

    // --- Configurações do Container (o "this") ---
    this.pivot.set(50, 75); // Define o "ponto de âncora" da carta inteira para o centro
    
    // Interatividade
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.on('pointerover', () => {
      this.scale.set(1.1);
      this.y -= 10; // Sobe um pouco
    });
    this.on('pointerout', () => {
      this.scale.set(1.0);
      this.y += 10; // Volta ao normal
    });
  }
}