import Phaser from "phaser";
import SplashScene from "./scenes/SplashScene.js";
import GameScene from "./scenes/GameScene.js";
import ShopScene from "./scenes/ShopScene.js";
import ChatScene from "./scenes/ChatScene.js";

console.log("🚀 Iniciando PoupaZenda...");
console.log("📦 Phaser version:", Phaser.VERSION);

// Configuração principal do Phaser - Mobile First
const config = {
  type: Phaser.AUTO,
  width: 414, // Largura padrão de smartphone (iPhone 11 Pro)
  height: 896, // Altura padrão de smartphone (iPhone 11 Pro)
  parent: "game-container",
  backgroundColor: "#87CEEB",
  scene: [SplashScene, GameScene, ShopScene, ChatScene], // Array de cenas - vai direto para o jogo
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    orientation: Phaser.Scale.PORTRAIT,
  },
  dom: {
    createContainer: true,
  },
  input: {
    activePointers: 3, // Suporte para multi-touch
  },
  render: {
    pixelArt: false,
    antialias: true,
  },
};

// Inicializa o jogo
const game = new Phaser.Game(config);

// Remove loading indicator quando o jogo estiver pronto
game.events.once("ready", () => {
  const loading = document.querySelector(".loading");
  if (loading) {
    loading.style.display = "none";
  }
  console.log("🎮 Jogo iniciado com sucesso!");
});

// Fallback: remove loading após 2 segundos se ainda estiver visível
setTimeout(() => {
  const loading = document.querySelector(".loading");
  if (loading && loading.style.display !== "none") {
    loading.style.display = "none";
    console.log("⚠️ Loading removido por timeout");
  }
}, 2000);
