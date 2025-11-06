// Este ficheiro contém a lógica "pura" do jogo, sem React ou Pixi.

/**
 * Cria um objeto de carta
 */
function criarCarta(naipe, valor) {
  return {
    id: `${valor}_de_${naipe}`,
    naipe: naipe, // ex: 'Copas'
    valor: valor, // ex: 'A'
  };
}

/**
 * Cria um baralho inicial (simplificado)
 */
export function criarBaralhoInicial() {
  const naipes = ['Copas', 'Paus', 'Ouros', 'Espadas'];
  const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const baralho = [];

  for (const naipe of naipes) {
    for (const valor of valores) {
      baralho.push(criarCarta(naipe, valor));
    }
  }
  
  // Embaralhar (Algoritmo Fisher-Yates)
  for (let i = baralho.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
  }
  
  return baralho;
}

/**
 * Puxa a carta do topo do baralho
 * (Isto é "imutável" - retorna novos arrays)
 */
export function puxarCarta(baralhoAtual) {
  // Copia o baralho para evitar mutação
  const novoBaralho = [...baralhoAtual]; 
  const cartaPuxada = novoBaralho.pop(); // Tira a última carta
  
  return { cartaPuxada, novoBaralho };
}
