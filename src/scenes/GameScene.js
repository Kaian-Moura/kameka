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
        this.load.image("fazendaFundo", "../assets/jogoFundo.png");
        this.load.image("xpIcon", "../assets/hud/xp.png");
        this.load.image("dinheiroIcon", "../assets/hud/dinheiro.png");
        this.load.image("fazendaIcone", "../assets/hud/fazendaIcone.png");
        this.load.image("missoesIcon", "../assets/hud/missoes.png");
        this.load.image("rankingIcon", "../assets/hud/ranking.png");
        this.load.image("lojaIcon", "../assets/hud/loja.png");
        this.load.image("depositoIcon", "../assets/hud/deposito.png");
        this.load.image("caseiroIcon", "../assets/hud/caseiro.png");
        this.load.image("terra", "../assets/terra.png");
        this.load.image("plantioFeijao", "../assets/hud/plantioFeijao.png");
        this.load.image("plantioMilho", "../assets/hud/plantioMilho.png");
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

        // XP icon in bottom-left
        const padding = 12;
        const iconScale = 0.05; // adjust size as needed
        const xpIcon = this.add.image(padding, height - padding, "xpIcon")
            .setOrigin(0, 5)   // position reference = bottom-left of the icon
            .setScale(iconScale);
        xpIcon.setScrollFactor(0);

        // XP text next to the icon
        const xpText = this.add.text(
            xpIcon.x + xpIcon.displayWidth + 8,
            height - padding - xpIcon.displayHeight / 2,
            `XP: ${this.playerData.xp}`,
            { font: "18px Arial", fill: "#ffffff" }
        ).setOrigin(0, 0.5);
        xpText.setScrollFactor(0);
    }
}