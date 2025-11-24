class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.playerData = {
      name: "Paulo",
      money: 500,
      xp: 0,
      level: 1,
    };
  }

  preload() {
    const base = window.ASSETS_PATH || "./assets/";
    this.load.image("fazendaFundo", base + "jogoFundo.png");
    this.load.image("hudCompleta", base + "hud/hudcompleta.png");
    this.load.image("terra", base + "terra.png");
    this.load.image("hudBaixo", base + "hud/hudbaixo.png");
    this.load.image("alfacePlantio", base + "hud/alfacePlantio.png");
  }

  create() {
    const { width, height } = this.cameras.main;

    // background (scaled to cover)
    const background = this.add.image(width / 2, height / 2, "fazendaFundo");
    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const bgScale = Math.max(scaleX, scaleY);
    background.setScale(bgScale);
    background.setScrollFactor(0);

    // hudcima in bottom-left
    const padding = 12;
    const hudCompletaScale = 0.35; // adjust size as needed
    const xpIcon = this.add
      .image(padding, height - padding, "hudCompleta")
      .setOrigin(0, 1.3)
      .setScale(hudCompletaScale);
    xpIcon.setScrollFactor(0);

    const paddingHudbaixo = 12;
    const hudBaixoScale = 0.35;
    const hudBaixoIcon = this.add
      .image(width / 2, height - paddingHudbaixo, "hudBaixo")
      .setOrigin(0.5, 1)
      .setScale(hudBaixoScale);
    hudBaixoIcon.setScrollFactor(0);

    // Função para adicionar clique nas terras
    const addTerraWithClick = (x, y, originX, originY, scale) => {
      const terra = this.add
        .image(x, y, "terra")
        .setOrigin(originX, originY)
        .setScale(scale);
      terra.setScrollFactor(0);
      terra.setInteractive({ useHandCursor: true });

      // Armazena se já tem plantio nesta terra
      terra.hasPlantio = false;

      terra.on("pointerdown", () => {
        if (!terra.hasPlantio) {
          // Calcula a posição central da terra baseado nos bounds
          const bounds = terra.getBounds();
          const centerX = bounds.centerX;
          const centerY = bounds.centerY;

          // Adiciona o alfacePlantio no centro da terra
          const plantio = this.add
            .image(centerX, centerY, "alfacePlantio")
            .setOrigin(0.5, 0.5)
            .setScale(scale);
          plantio.setScrollFactor(0);
          terra.hasPlantio = true;
        }
      });

      return terra;
    };

    const paddingTerra = 12;
    const terraScale = 0.15;
    const terraIcon = addTerraWithClick(
      width / 2,
      height - paddingTerra,
      0.3,
      1.5,
      terraScale
    );

    const paddingTerra2 = 12;
    const terraScale2 = 0.15;
    const terraIcon2 = addTerraWithClick(
      width / 2,
      height - paddingTerra2,
      -0.22,
      1.9,
      terraScale2
    );

    const paddingTerra3 = 12;
    const terraScale3 = 0.15;
    const terraIcon3 = addTerraWithClick(
      width / 2,
      height - paddingTerra3,
      0.6,
      2,
      terraScale3
    );

    // Terras do lado esquerdo
    const paddingTerra4 = 12;
    const terraScale4 = 0.15;
    const terraIcon4 = addTerraWithClick(
      width / 2,
      height - paddingTerra4,
      0.82,
      2.4,
      terraScale4
    );

    const paddingTerra5 = 12;
    const terraScale5 = 0.15;
    const terraIcon5 = addTerraWithClick(
      width / 2,
      height - paddingTerra5,
      1.34,
      1.9,
      terraScale5
    );

    // Quadrado invisível no canto inferior esquerdo (clicável para loja)
    const quadradoSize = 85;
    const quadradoPosX = 64;
    const quadradoPosY = height - 65;

    // Borda de debug (para visualizar onde está)
    const debugQuadrado = this.add.graphics();
    debugQuadrado.lineStyle(2, 0xff0000, 1);
    debugQuadrado.strokeRect(
      quadradoPosX - quadradoSize / 2,
      quadradoPosY - quadradoSize / 2,
      quadradoSize,
      quadradoSize
    );
    debugQuadrado.setScrollFactor(0);

    // Zona invisível clicável
    const quadradoInvisivel = this.add.zone(
      quadradoPosX,
      quadradoPosY,
      quadradoSize,
      quadradoSize
    );
    quadradoInvisivel.setScrollFactor(0);
    quadradoInvisivel.setInteractive({ useHandCursor: true });

    quadradoInvisivel.on("pointerdown", () => {
      this.scene.start("ShopScene");
    });

    // Segundo quadrado invisível no canto inferior (um pouco à direita)
    const quadrado2Size = 85;
    const quadrado2PosX = quadradoPosX + 190;
    const quadrado2PosY = quadradoPosY; // Mesmo Y

    // Borda de debug (para visualizar onde está)
    const debugQuadrado2 = this.add.graphics();
    debugQuadrado2.lineStyle(2, 0x00ff00, 1); // Verde para diferenciar
    debugQuadrado2.strokeRect(
      quadrado2PosX - quadrado2Size / 2,
      quadrado2PosY - quadrado2Size / 2,
      quadrado2Size,
      quadrado2Size
    );
    debugQuadrado2.setScrollFactor(0);

    // Zona invisível clicável
    const quadrado2Invisivel = this.add.zone(
      quadrado2PosX,
      quadrado2PosY,
      quadrado2Size,
      quadrado2Size
    );
    quadrado2Invisivel.setScrollFactor(0);
    quadrado2Invisivel.setInteractive({ useHandCursor: true });

    quadrado2Invisivel.on("pointerdown", () => {
      console.log("Abrindo chat com Caseiro-IA...");
      this.scene.start("ChatScene");
    });
  }
}

export default GameScene;
