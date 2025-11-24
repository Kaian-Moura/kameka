// Configuração principal do Phaser - Mobile First
const config = {
  type: Phaser.AUTO,
  width: 414, // Largura padrão de smartphone (iPhone 11 Pro)
  height: 896, // Altura padrão de smartphone (iPhone 11 Pro)
  parent: "game-container",
  backgroundColor: "#87CEEB",
  scene: [SplashScene, GameScene], // Array de cenas - vai direto para o jogo
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

// Remove loading indicator ao iniciar
window.addEventListener("load", () => {
  const loading = document.querySelector(".loading");
  if (loading) {
    loading.style.display = "none";
  }
});

// Inicializa o jogo
const game = new Phaser.Game(config);
