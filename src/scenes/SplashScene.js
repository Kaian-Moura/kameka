class SplashScene extends Phaser.Scene {
  constructor() {
    super({ key: "SplashScene" });
  }

  preload() {
    // Carrega os assets
    this.load.image("background", "../assets/fazenda fundo.png");
    this.load.image("logo", "../assets/logo.png");
  }

  create() {
    const { width, height } = this.cameras.main;

    // Adiciona o fundo da fazenda
    const background = this.add.image(width / 2, height / 2, "background");

    // Ajusta o fundo para cobrir toda a tela mantendo proporção
    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);

    // Adiciona a logo centralizada
    const logo = this.add.image(width / 2, height / 2, "logo");

    // Ajusta o tamanho da logo (aproximadamente 60% da largura da tela)
    const logoScale = (width * 0.6) / logo.width;
    logo.setScale(logoScale);

    // Animação de fade in da logo
    logo.setAlpha(0);
    this.tweens.add({
      targets: logo,
      alpha: 1,
      duration: 1000,
      ease: "Power2",
    });

    // Animação de pulsação suave da logo
    this.tweens.add({
      targets: logo,
      scale: logoScale * 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Texto de carregamento (opcional)
    const loadingText = this.add.text(
      width / 2,
      height - 80,
      "Toque para começar",
      {
        fontSize: "24px",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 4,
        fontStyle: "bold",
      }
    );
    loadingText.setOrigin(0.5);

    // Animação de fade no texto
    loadingText.setAlpha(0);
    this.tweens.add({
      targets: loadingText,
      alpha: 1,
      duration: 1000,
      delay: 1500,
      ease: "Power2",
    });

    // Animação de piscar do texto
    this.tweens.add({
      targets: loadingText,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1,
      delay: 2500,
      ease: "Sine.easeInOut",
    });

    // Transição para a próxima cena após 3 segundos ou ao clicar
    this.time.delayedCall(3000, () => {
      this.input.on("pointerdown", () => {
        this.fadeOutAndTransition();
      });
    });

    // Auto-transição após 8 segundos
    this.time.delayedCall(8000, () => {
      this.fadeOutAndTransition();
    });
  }

  fadeOutAndTransition() {
    // Previne múltiplas transições
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Fade out antes de ir para a próxima cena
    this.cameras.main.fadeOut(1000, 0, 0, 0);

    this.cameras.main.once("camerafadeoutcomplete", () => {
      // Transição direta para o jogo
      this.scene.start("GameScene");
    });
  }
}
