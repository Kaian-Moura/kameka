class ShopScene extends Phaser.Scene {
  constructor() {
    super({ key: "ShopScene" });

    // Array com todos os itens da loja
    this.shopItems = [
      {
        name: "Alface",
        type: "CDI",
        image: "alfacePlantio",
        description: "Cresce rápido, sempre\nrende um pouco.",
        price: 100,
        iconColor: 0x7cb342,
        imageScale: 0.4,
        fontSize: "72px",
      },
      {
        name: "Feijão",
        type: "IPCA",
        image: "plantioFeijao",
        description: "Planta resistente, cresce\nmesmo com clima adverso.",
        price: 200,
        iconColor: 0x8b6f47,
        imageScale: 0.17,
        fontSize: "72px",
      },
      {
        name: "Sementes Especiais",
        type: "INVESTIMENTO\nDE RISCO",
        image: "sementesEspeciais",
        description:
          "Podem gerar altos retornos ou\nperdas, ensinando a lidar com risco.",
        price: 500,
        iconColor: 0x5a9aaa,
        imageScale: 0.22,
        fontSize: "42px",
      },
    ];

    this.currentItemIndex = 0;
  }

  preload() {
    // Carrega os assets necessários
    const base = window.ASSETS_PATH || './assets/';
    this.load.image("shopBackground", base + "jogoFundo.png");
    this.load.image("alfacePlantio", base + "hud/alfacePlantio.png");
    this.load.image("plantioFeijao", base + "feijao.png");
    this.load.image("sementesEspeciais", base + "SEMENTES.png");
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background com o mesmo estilo do jogo
    const background = this.add.image(width / 2, height / 2, "shopBackground");
    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const bgScale = Math.max(scaleX, scaleY);
    background.setScale(bgScale);

    // Botão de voltar no canto superior esquerdo
    const backButton = this.createButton(
      80,
      80,
      100,
      100,
      0x5c9bc4,
      0x4a7ea0,
      "<",
      () => {
        this.scene.start("GameScene");
      }
    );

    // Botão de ajuda no canto superior direito
    const helpButton = this.createButton(
      width - 80,
      80,
      100,
      100,
      0x4a5568,
      0x3a4558,
      "?",
      () => {
        console.log("Ajuda clicada");
        // Adicione lógica de ajuda aqui
      }
    );

    // Botões de navegação (setas verdes) - criar ANTES do card
    this.leftArrow = this.createNavigationArrow(100, height / 2, "left");
    this.rightArrow = this.createNavigationArrow(
      width - 100,
      height / 2,
      "right"
    );

    // Renderiza o card do item atual
    this.renderCurrentItem();
  }

  renderCurrentItem() {
    const { width, height } = this.cameras.main;
    const currentItem = this.shopItems[this.currentItemIndex];

    // Limpa os elementos anteriores se existirem
    if (this.cardGroup) {
      this.cardGroup.destroy(true);
    }
    if (this.infoBoxGraphics) {
      this.infoBoxGraphics.destroy();
    }
    if (this.infoTextObject) {
      this.infoTextObject.destroy();
    }

    // Cria um grupo para facilitar a limpeza
    this.cardGroup = this.add.container();

    // Card principal da loja
    this.createShopCard(width / 2, height / 2, currentItem);

    // Texto informativo na parte inferior
    this.infoBoxGraphics = this.add.graphics();
    this.infoBoxGraphics.fillStyle(0x7cb342, 0.8);
    this.infoBoxGraphics.fillRoundedRect(
      width / 2 - 280,
      height - 180,
      560,
      120,
      20
    );

    this.infoTextObject = this.add
      .text(width / 2, height - 120, currentItem.description, {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }

  navigateItems(direction) {
    if (direction === "left") {
      this.currentItemIndex--;
      if (this.currentItemIndex < 0) {
        this.currentItemIndex = this.shopItems.length - 1;
      }
    } else {
      this.currentItemIndex++;
      if (this.currentItemIndex >= this.shopItems.length) {
        this.currentItemIndex = 0;
      }
    }

    this.renderCurrentItem();
  }

  createButton(x, y, width, height, color, hoverColor, text, onClick) {
    const button = this.add.graphics();

    // Fundo do botão com bordas arredondadas
    button.fillStyle(color);
    button.fillRoundedRect(x - width / 2, y - height / 2, width, height, 20);

    // Borda do botão
    button.lineStyle(4, 0xffffff, 0.8);
    button.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 20);

    // Sombra inferior (efeito 3D)
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.2);
    shadow.fillRoundedRect(
      x - width / 2,
      y - height / 2 + 6,
      width,
      height,
      20
    );
    shadow.setDepth(-1);

    // Texto do botão
    const buttonText = this.add
      .text(x, y, text, {
        fontFamily: "Arial",
        fontSize: text === "?" ? "48px" : "64px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Criar área interativa
    const hitArea = this.add.rectangle(x, y, width, height);
    hitArea.setInteractive({ useHandCursor: true });

    hitArea.on("pointerdown", onClick);

    hitArea.on("pointerover", () => {
      button.clear();
      button.fillStyle(hoverColor);
      button.fillRoundedRect(x - width / 2, y - height / 2, width, height, 20);
      button.lineStyle(4, 0xffffff, 0.8);
      button.strokeRoundedRect(
        x - width / 2,
        y - height / 2,
        width,
        height,
        20
      );
    });

    hitArea.on("pointerout", () => {
      button.clear();
      button.fillStyle(color);
      button.fillRoundedRect(x - width / 2, y - height / 2, width, height, 20);
      button.lineStyle(4, 0xffffff, 0.8);
      button.strokeRoundedRect(
        x - width / 2,
        y - height / 2,
        width,
        height,
        20
      );
    });

    return { button, text: buttonText, hitArea };
  }

  createShopCard(x, y, item) {
    const cardWidth = 450;
    const cardHeight = 600;

    // Card principal com gradiente azul
    const card = this.add.graphics();
    card.fillStyle(0x2196f3);
    card.fillRoundedRect(
      x - cardWidth / 2,
      y - cardHeight / 2,
      cardWidth,
      cardHeight,
      30
    );
    this.cardGroup.add(card);

    // Borda branca do card
    card.lineStyle(5, 0xffffff);
    card.strokeRoundedRect(
      x - cardWidth / 2,
      y - cardHeight / 2,
      cardWidth,
      cardHeight,
      30
    );

    // Ícone do item - círculo com borda
    const iconSize = 180;
    const iconY = y - 120;

    const iconBg = this.add.graphics();
    iconBg.fillStyle(item.iconColor);
    iconBg.lineStyle(5, 0x2d5016);
    iconBg.fillCircle(x, iconY, iconSize / 2);
    iconBg.strokeCircle(x, iconY, iconSize / 2);
    this.cardGroup.add(iconBg);

    // Imagem do item no centro
    const itemImage = this.add.image(x, iconY, item.image);
    itemImage.setScale(item.imageScale);
    this.cardGroup.add(itemImage);

    // Texto do tipo (CDI, IPCA, etc)
    const typeText = this.add
      .text(x, y + 70, item.type, {
        fontFamily: "Arial",
        fontSize: item.fontSize,
        color: "#ffffff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);
    this.cardGroup.add(typeText);

    // Botão de comprar
    const buyButtonY = y + 190;
    const buyButton = this.add.graphics();
    buyButton.fillStyle(0x7cb342);
    buyButton.fillRoundedRect(x - 180, buyButtonY - 40, 360, 80, 15);

    // Borda do botão de comprar
    buyButton.lineStyle(4, 0xffffff);
    buyButton.strokeRoundedRect(x - 180, buyButtonY - 40, 360, 80, 15);
    this.cardGroup.add(buyButton);

    // Sombra do botão (efeito 3D)
    const buyShadow = this.add.graphics();
    buyShadow.fillStyle(0x5a9216);
    buyShadow.fillRoundedRect(x - 180, buyButtonY - 35, 360, 80, 15);
    buyShadow.setDepth(-1);
    this.cardGroup.add(buyShadow);

    // Texto do botão
    const buyText = this.add
      .text(x, buyButtonY, "Comprar", {
        fontFamily: "Arial",
        fontSize: "42px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.cardGroup.add(buyText);

    // Área clicável do botão
    const buyHitArea = this.add.rectangle(x, buyButtonY, 360, 80);
    buyHitArea.setInteractive({ useHandCursor: true });
    this.cardGroup.add(buyHitArea);

    buyHitArea.on("pointerdown", () => {
      console.log("Comprando item:", item.name, "- Preço:", item.price);
      // Adicione lógica de compra aqui
    });

    // Guardar referência para o hover funcionar
    const buttonRef = buyButton;

    buyHitArea.on("pointerover", () => {
      buttonRef.clear();
      buttonRef.fillStyle(0x8bc34a);
      buttonRef.fillRoundedRect(x - 180, buyButtonY - 40, 360, 80, 15);
      buttonRef.lineStyle(4, 0xffffff);
      buttonRef.strokeRoundedRect(x - 180, buyButtonY - 40, 360, 80, 15);
    });

    buyHitArea.on("pointerout", () => {
      buttonRef.clear();
      buttonRef.fillStyle(0x7cb342);
      buttonRef.fillRoundedRect(x - 180, buyButtonY - 40, 360, 80, 15);
      buttonRef.lineStyle(4, 0xffffff);
      buttonRef.strokeRoundedRect(x - 180, buyButtonY - 40, 360, 80, 15);
    });
  }

  createNavigationArrow(x, y, direction) {
    const arrowSize = 80;

    // Fundo da seta
    const arrowBg = this.add.graphics();
    arrowBg.fillStyle(0x7cb342);
    arrowBg.fillRoundedRect(
      x - arrowSize / 2,
      y - arrowSize / 2,
      arrowSize,
      arrowSize,
      15
    );

    // Borda da seta
    arrowBg.lineStyle(3, 0xffffff);
    arrowBg.strokeRoundedRect(
      x - arrowSize / 2,
      y - arrowSize / 2,
      arrowSize,
      arrowSize,
      15
    );
    arrowBg.setDepth(100); // Garante que fica na frente

    // Desenha a seta
    const arrow = this.add.graphics();
    arrow.fillStyle(0xffffff);
    arrow.lineStyle(4, 0xffffff);
    arrow.setDepth(101); // Fica na frente do fundo

    if (direction === "left") {
      // Seta para esquerda
      arrow.beginPath();
      arrow.moveTo(x + 15, y - 25);
      arrow.lineTo(x - 15, y);
      arrow.lineTo(x + 15, y + 25);
      arrow.strokePath();
    } else {
      // Seta para direita
      arrow.beginPath();
      arrow.moveTo(x - 15, y - 25);
      arrow.lineTo(x + 15, y);
      arrow.lineTo(x - 15, y + 25);
      arrow.strokePath();
    }

    // Área clicável
    const hitArea = this.add.rectangle(x, y, arrowSize, arrowSize);
    hitArea.setInteractive({ useHandCursor: true });
    hitArea.setDepth(102); // Fica no topo para capturar cliques

    hitArea.on("pointerdown", () => {
      this.navigateItems(direction);
    });

    hitArea.on("pointerover", () => {
      arrowBg.clear();
      arrowBg.fillStyle(0x8bc34a);
      arrowBg.fillRoundedRect(
        x - arrowSize / 2,
        y - arrowSize / 2,
        arrowSize,
        arrowSize,
        15
      );
      arrowBg.lineStyle(3, 0xffffff);
      arrowBg.strokeRoundedRect(
        x - arrowSize / 2,
        y - arrowSize / 2,
        arrowSize,
        arrowSize,
        15
      );
    });

    hitArea.on("pointerout", () => {
      arrowBg.clear();
      arrowBg.fillStyle(0x7cb342);
      arrowBg.fillRoundedRect(
        x - arrowSize / 2,
        y - arrowSize / 2,
        arrowSize,
        arrowSize,
        15
      );
      arrowBg.lineStyle(3, 0xffffff);
      arrowBg.strokeRoundedRect(
        x - arrowSize / 2,
        y - arrowSize / 2,
        arrowSize,
        arrowSize,
        15
      );
    });

    return { arrowBg, arrow, hitArea };
  }
}

export default ShopScene;
