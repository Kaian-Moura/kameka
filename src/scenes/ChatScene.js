import { getCaseiroAI } from "../ai/caseiroAI.js";

class ChatScene extends Phaser.Scene {
  constructor() {
    super({ key: "ChatScene" });
    this.chatHistory = [];
    this.isWaitingForResponse = false;
    this.caseiroAI = getCaseiroAI();
    this.isAIReady = false;
  }

  preload() {
    // Carregar assets necessários
    const base = window.ASSETS_PATH || "./assets/";
    this.load.image("jogo-fundo", base + "jogoFundo.png");
    this.load.image("caseiro-avatar", base + "hud/caseiro.png");
  }

  async create() {
    // Inicializar a IA em background
    this.initializeAI();
    const { width, height } = this.cameras.main;

    // Background com imagem do jogo (jogoFundo.png - parte azul)
    const backgroundImage = this.add.image(width / 2, height / 2, "jogo-fundo");
    backgroundImage.setDisplaySize(width, height);

    // Overlay escuro para melhorar legibilidade do chat
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.4);
    overlay.fillRect(0, 0, width, height);

    // Responsividade: ajustar tamanho do chat baseado na tela
    const isMobile = width < 640;
    const chatWidth = isMobile ? width * 0.95 : width * 0.85;
    const chatHeight = isMobile ? height * 0.9 : height * 0.85;
    const chatX = (width - chatWidth) / 2;
    const chatY = (height - chatHeight) / 2;

    // Background do chat com sombra
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.2);
    shadow.fillRoundedRect(chatX + 5, chatY + 5, chatWidth, chatHeight, 15);
    shadow.setBlendMode(Phaser.BlendModes.MULTIPLY);

    // Background do chat (branco)
    const chatBg = this.add.graphics();
    chatBg.fillStyle(0xffffff, 1);
    chatBg.fillRoundedRect(chatX, chatY, chatWidth, chatHeight, 15);

    // Header do chat (verde estilo moderno)
    const headerHeight = isMobile ? 55 : 65;
    const headerBg = this.add.graphics();
    headerBg.fillStyle(0x22c55e, 1); // Green-500
    headerBg.fillRoundedRect(chatX, chatY, chatWidth, headerHeight, {
      tl: 15,
      tr: 15,
      bl: 0,
      br: 0,
    });

    // Avatar do Caseiro (imagem pixel art)
    const avatarSize = isMobile ? 40 : 48;
    const headerIcon = this.add.image(
      chatX + 15 + avatarSize / 2,
      chatY + headerHeight / 2,
      "caseiro-avatar"
    );
    headerIcon.setDisplaySize(avatarSize, avatarSize);
    headerIcon.setOrigin(0.5, 0.5);

    // Círculo branco de fundo no avatar
    const avatarBg = this.add.graphics();
    avatarBg.fillStyle(0xffffff, 1);
    avatarBg.fillCircle(
      chatX + 15 + avatarSize / 2,
      chatY + headerHeight / 2,
      avatarSize / 2 + 2
    );
    avatarBg.setDepth(-1);
    headerIcon.setDepth(0);

    // Título com subtítulo (ajustado para o avatar)
    const titleX = chatX + (isMobile ? 65 : 75);
    const headerTitle = this.add
      .text(titleX, chatY + headerHeight / 2 - 8, "Caseiro-IA", {
        fontSize: isMobile ? "18px" : "22px",
        color: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Arial, sans-serif",
      })
      .setOrigin(0, 0.5);

    const headerSubtitle = this.add
      .text(titleX, chatY + headerHeight / 2 + 12, "Seu mentor financeiro 🌱", {
        fontSize: isMobile ? "11px" : "13px",
        color: "#d1fae5",
        fontFamily: "Arial, sans-serif",
      })
      .setOrigin(0, 0.5);

    // Botão fechar moderno (X circular)
    const closeButtonX = chatX + chatWidth - 35;
    const closeButtonY = chatY + headerHeight / 2;

    const closeButtonBg = this.add.graphics();
    closeButtonBg.fillStyle(0xffffff, 0.2);
    closeButtonBg.fillCircle(closeButtonX, closeButtonY, 18);

    const closeButton = this.add
      .text(closeButtonX, closeButtonY, "✕", {
        fontSize: isMobile ? "24px" : "28px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    closeButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    closeButton.on("pointerover", () => {
      closeButton.setScale(1.1);
      closeButtonBg.clear();
      closeButtonBg.fillStyle(0xffffff, 0.3);
      closeButtonBg.fillCircle(closeButtonX, closeButtonY, 18);
    });

    closeButton.on("pointerout", () => {
      closeButton.setScale(1);
      closeButtonBg.clear();
      closeButtonBg.fillStyle(0xffffff, 0.2);
      closeButtonBg.fillCircle(closeButtonX, closeButtonY, 18);
    });

    // Área de mensagens
    const messagesAreaY = chatY + headerHeight + 10;
    const messagesAreaHeight = chatHeight - headerHeight - (isMobile ? 75 : 85);

    // Armazena valores para uso posterior
    this.messagesAreaY = messagesAreaY;
    this.messagesAreaX = chatX;
    this.chatContainerY = chatY;
    this.chatContainerHeight = chatHeight;
    this.chatWidth = chatWidth;
    this.isMobile = isMobile;

    // Container para scroll de mensagens
    const scrollMask = this.add.graphics();
    scrollMask.fillStyle(0xffffff);
    scrollMask.fillRect(
      chatX + 10,
      messagesAreaY,
      chatWidth - 20,
      messagesAreaHeight
    );

    this.messagesContainer = this.add.container(0, 0);

    // Mensagem inicial do Caseiro
    this.addMessage(
      "E aí! 👋 Sou o Caseiro-IA, seu parceiro pra dominar as finanças da fazenda! 🌱\n\nCada plantio aqui é tipo um investimento real: tem prazo, risco e retorno. Bora aprender?",
      "caseiro"
    );

    // Input de texto (simulado com DOM)
    this.createInputArea(width, height, chatX, chatY, chatWidth, chatHeight);
  }

  async initializeAI() {
    try {
      console.log("🚀 Verificando disponibilidade da IA...");

      // Tentar inicializar a IA
      await this.caseiroAI.initialize();

      // Se chegou aqui e a IA está pronta, mostrar sucesso
      if (this.caseiroAI.isReady) {
        this.isAIReady = true;
        console.log("✅ IA carregada com sucesso!");

        // Mostrar mensagem de sucesso temporária
        const successMsg = this.add
          .text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "✅ IA conectada!",
            {
              fontSize: "16px",
              color: "#16a34a",
              align: "center",
              backgroundColor: "#ffffff",
              padding: { x: 20, y: 10 },
            }
          )
          .setOrigin(0.5, 0.5);

        this.time.delayedCall(2000, () => {
          successMsg.destroy();
        });
      } else {
        // Token não configurado - modo normal com respostas mock
        this.isAIReady = false;
        console.log("ℹ️ Modo chat com respostas inteligentes ativado.");
      }
    } catch (error) {
      // Erro inesperado ao tentar conectar
      console.error("❌ Erro ao inicializar IA:", error.message);
      this.isAIReady = false;
    }
  }

  createInputArea(width, height, chatX, chatY, chatWidth, chatHeight) {
    const isMobile = this.isMobile;
    const inputHeight = isMobile ? 50 : 55;
    const inputY = chatY + chatHeight - inputHeight - 10;
    const inputPadding = isMobile ? 10 : 15;
    const buttonWidth = isMobile ? 70 : 90;

    // Background da área de input (cinza claro)
    const inputAreaBg = this.add.graphics();
    inputAreaBg.fillStyle(0xf3f4f6, 1);
    inputAreaBg.fillRoundedRect(
      chatX,
      inputY - 5,
      chatWidth,
      inputHeight + 10,
      { tl: 0, tr: 0, bl: 15, br: 15 }
    );

    // Background do input (branco com borda)
    const inputBg = this.add.graphics();
    inputBg.lineStyle(2, 0xe5e7eb, 1);
    inputBg.fillStyle(0xffffff, 1);
    inputBg.fillRoundedRect(
      chatX + inputPadding,
      inputY,
      chatWidth - buttonWidth - inputPadding * 2,
      inputHeight,
      8
    );
    inputBg.strokeRoundedRect(
      chatX + inputPadding,
      inputY,
      chatWidth - buttonWidth - inputPadding * 2,
      inputHeight,
      8
    );

    // Pegar posição do canvas no DOM
    const canvas = this.game.canvas;
    const canvasRect = canvas.getBoundingClientRect();

    // Calcular escala do canvas
    const scaleX = canvasRect.width / width;
    const scaleY = canvasRect.height / height;

    // Criar elemento HTML para input com estilo moderno
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.placeholder = isMobile
      ? "Mensagem..."
      : "Digite sua mensagem...";
    inputElement.style.position = "absolute";
    inputElement.style.left = `${
      canvasRect.left + (chatX + inputPadding + 5) * scaleX
    }px`;
    inputElement.style.top = `${canvasRect.top + (inputY + 5) * scaleY}px`;
    inputElement.style.width = `${
      (chatWidth - buttonWidth - inputPadding * 2 - 10) * scaleX
    }px`;
    inputElement.style.height = `${(inputHeight - 10) * scaleY}px`;
    inputElement.style.fontSize = isMobile ? "14px" : "16px";
    inputElement.style.fontFamily = "Arial, sans-serif";
    inputElement.style.padding = isMobile ? "8px 12px" : "10px 15px";
    inputElement.style.border = "none";
    inputElement.style.borderRadius = "8px";
    inputElement.style.outline = "none";
    inputElement.style.backgroundColor = "#ffffff";
    inputElement.style.color = "#1f2937";
    inputElement.style.zIndex = "1000";
    inputElement.style.boxSizing = "border-box";
    inputElement.style.transition = "all 0.2s ease";

    // Adicionar focus/blur effects
    inputElement.addEventListener("focus", () => {
      inputElement.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.2)";
    });

    inputElement.addEventListener("blur", () => {
      inputElement.style.boxShadow = "none";
    });

    document.body.appendChild(inputElement);

    // Botão enviar moderno (verde)
    const sendButtonX = chatX + chatWidth - buttonWidth - inputPadding + 5;
    const sendButtonY = inputY + inputHeight / 2;

    const sendButtonBg = this.add.graphics();
    sendButtonBg.fillStyle(0x22c55e, 1); // Green-500
    sendButtonBg.fillRoundedRect(
      sendButtonX,
      inputY,
      buttonWidth - 10,
      inputHeight,
      8
    );

    const sendButton = this.add
      .text(
        sendButtonX + (buttonWidth - 10) / 2,
        sendButtonY,
        isMobile ? "➤" : "Enviar",
        {
          fontSize: isMobile ? "22px" : "16px",
          color: "#ffffff",
          fontStyle: "bold",
          fontFamily: "Arial, sans-serif",
        }
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    sendButton.on("pointerdown", () => {
      if (inputElement.value.trim()) {
        this.sendMessage(inputElement.value);
        inputElement.value = "";
        inputElement.focus();
      }
    });

    sendButton.on("pointerover", () => {
      sendButton.setScale(1.05);
      sendButtonBg.clear();
      sendButtonBg.fillStyle(0x16a34a, 1); // Green-600
      sendButtonBg.fillRoundedRect(
        sendButtonX,
        inputY,
        buttonWidth - 10,
        inputHeight,
        8
      );
    });

    sendButton.on("pointerout", () => {
      sendButton.setScale(1);
      sendButtonBg.clear();
      sendButtonBg.fillStyle(0x22c55e, 1);
      sendButtonBg.fillRoundedRect(
        sendButtonX,
        inputY,
        buttonWidth - 10,
        inputHeight,
        8
      );
    });

    // Enviar com Enter
    inputElement.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && inputElement.value.trim()) {
        this.sendMessage(inputElement.value);
        inputElement.value = "";
      }
    });

    // Reposicionar input ao redimensionar a janela
    const repositionInput = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const scaleX = canvasRect.width / width;
      const scaleY = canvasRect.height / height;

      inputElement.style.left = `${canvasRect.left + width * 0.12 * scaleX}px`;
      inputElement.style.top = `${canvasRect.top + inputY * scaleY}px`;
      inputElement.style.width = `${width * 0.6 * scaleX}px`;
      inputElement.style.height = `${45 * scaleY}px`;
    };

    window.addEventListener("resize", repositionInput);

    // Limpar input ao sair da cena
    this.events.on("shutdown", () => {
      window.removeEventListener("resize", repositionInput);
      if (inputElement.parentNode) {
        inputElement.parentNode.removeChild(inputElement);
      }
    });

    // Focar automaticamente no input após um breve delay
    this.time.delayedCall(500, () => {
      inputElement.focus();
    });

    this.inputElement = inputElement;
  }

  addMessage(text, sender = "user") {
    const { width, height } = this.cameras.main;
    const isMobile = this.isMobile;
    const chatWidth = this.chatWidth;
    const chatX = this.messagesAreaX || width * 0.1;

    // Calcular altura total das mensagens anteriores
    let totalHeight = 0;
    this.chatHistory.forEach((msg) => {
      totalHeight += msg.height + 15;
    });

    const baseY = this.messagesAreaY || 150;
    const messageY = baseY + totalHeight;

    const isCaseiro = sender === "caseiro";

    // Cores modernas (Tailwind-style)
    const bgColor = isCaseiro ? 0x22c55e : 0xf3f4f6; // Green-500 vs Gray-100
    const textColor = isCaseiro ? "#ffffff" : "#1f2937"; // White vs Gray-800

    // Tamanho responsivo
    const maxWidth = isMobile ? chatWidth * 0.85 : chatWidth * 0.7;
    const messagePadding = isMobile ? 12 : 16;
    const fontSize = isMobile ? "14px" : "15px";

    // Calcular altura da mensagem baseado no texto
    const tempText = this.add.text(0, 0, text, {
      fontSize: fontSize,
      fontFamily: "Arial, sans-serif",
      wordWrap: { width: maxWidth - messagePadding * 2 },
    });
    const textHeight = tempText.height;
    const textWidth = Math.min(tempText.width, maxWidth - messagePadding * 2);
    tempText.destroy();

    const messageWidth = Math.min(textWidth + messagePadding * 2, maxWidth);
    const messageHeight = textHeight + messagePadding * 2;

    // Posicionar mensagem (caseiro à esquerda, usuário à direita)
    const messageX = isCaseiro
      ? chatX + 15
      : chatX + chatWidth - messageWidth - 15;

    // Background da mensagem com sombra suave
    const messageShadow = this.add.graphics();
    messageShadow.fillStyle(0x000000, 0.1);
    messageShadow.fillRoundedRect(
      messageX + 2,
      messageY + 2,
      messageWidth,
      messageHeight,
      isCaseiro
        ? { tl: 15, tr: 15, bl: 5, br: 15 }
        : { tl: 15, tr: 15, bl: 15, br: 5 }
    );

    const messageBg = this.add.graphics();
    messageBg.fillStyle(bgColor, 1);
    messageBg.fillRoundedRect(
      messageX,
      messageY,
      messageWidth,
      messageHeight,
      isCaseiro
        ? { tl: 15, tr: 15, bl: 5, br: 15 }
        : { tl: 15, tr: 15, bl: 15, br: 5 }
    );

    // Texto da mensagem
    const messageText = this.add
      .text(messageX + messagePadding, messageY + messagePadding, text, {
        fontSize: fontSize,
        color: textColor,
        fontFamily: "Arial, sans-serif",
        wordWrap: { width: messageWidth - messagePadding * 2 },
        lineSpacing: 4,
      })
      .setOrigin(0, 0);

    // Timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const timeText = this.add
      .text(
        messageX + messageWidth - messagePadding,
        messageY + messageHeight - messagePadding + 2,
        timeString,
        {
          fontSize: isMobile ? "10px" : "11px",
          color: isCaseiro ? "rgba(255, 255, 255, 0.7)" : "#9ca3af",
          fontFamily: "Arial, sans-serif",
        }
      )
      .setOrigin(1, 0);

    this.messagesContainer.add([
      messageShadow,
      messageBg,
      messageText,
      timeText,
    ]);

    this.chatHistory.push({ text, sender, height: messageHeight });

    // Scroll automático suave (apenas se necessário)
    const maxVisibleHeight = this.chatContainerHeight - 150;
    if (totalHeight + messageHeight + 15 > maxVisibleHeight) {
      const scrollAmount = -(messageHeight + 15);
      this.tweens.add({
        targets: this.messagesContainer,
        y: this.messagesContainer.y + scrollAmount,
        duration: 300,
        ease: "Power2",
      });
    }
  }

  async sendMessage(message) {
    if (!message.trim() || this.isWaitingForResponse) return;

    this.isWaitingForResponse = true;

    // Adicionar mensagem do usuário
    this.addMessage(message, "user");

    // Criar indicador de digitação moderno (três pontos animados)
    const chatX = this.messagesAreaX || this.cameras.main.width * 0.1;
    const chatWidth = this.chatWidth;

    let totalHeight = 0;
    this.chatHistory.forEach((msg) => {
      totalHeight += msg.height + 15;
    });
    const typingY = this.messagesAreaY + totalHeight;

    const typingBubble = this.add.graphics();
    typingBubble.fillStyle(0xf3f4f6, 1);
    typingBubble.fillRoundedRect(chatX + 15, typingY, 60, 35, 15);

    // Três pontos animados
    const dots = [];
    for (let i = 0; i < 3; i++) {
      const dot = this.add.circle(
        chatX + 30 + i * 12,
        typingY + 17,
        4,
        0x9ca3af
      );
      dots.push(dot);

      // Animar cada ponto com delay
      this.tweens.add({
        targets: dot,
        y: typingY + 14,
        duration: 400,
        yoyo: true,
        repeat: -1,
        delay: i * 150,
        ease: "Sine.easeInOut",
      });
    }

    try {
      // Chamar a API da IA
      const response = await this.getAIResponse(message);

      // Remover indicador de digitação
      typingBubble.destroy();
      dots.forEach((dot) => dot.destroy());

      // Adicionar resposta da IA
      this.addMessage(response, "caseiro");
    } catch (error) {
      console.error("Erro ao obter resposta da IA:", error);
      typingBubble.destroy();
      dots.forEach((dot) => dot.destroy());
      this.addMessage(
        "Ops! 😅 Tive um problema técnico aqui. Mas vamos tentar de novo? Me pergunta outra coisa!",
        "caseiro"
      );
    }

    this.isWaitingForResponse = false;
  }

  async getAIResponse(userMessage) {
    const gameScene = this.scene.get("GameScene");
    const playerContext = gameScene?.playerData || {
      name: "Paulo",
      money: 500,
      xp: 0,
      level: 1,
    };

    try {
      // tenta inicializar SEM depender do isAIReady
      if (!this.caseiroAI.isReady) {
        console.log("🔄 IA não pronta ainda, tentando iniciar agora...");
        await this.caseiroAI.initialize();
      }

      console.log("🤖 Gerando resposta com IA (HF online)...");
      const response = await Promise.race([
        this.caseiroAI.chat(userMessage, playerContext),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout na resposta da IA")),
            30000
          )
        ),
      ]);

      console.log("✅ IA respondeu!");
      this.isAIReady = true; // marca como pronta depois que respondeu de verdade
      return response;
    } catch (error) {
      console.error("❌ IA falhou, caindo no mock. Erro completo:", error);
      this.isAIReady = false;
      return this.getMockResponse(userMessage);
    }
  }

  getMockResponse(userMessage) {
    // Respostas inteligentes (fallback quando IA não está disponível)
    const lowerMessage = userMessage.toLowerCase();

    // Saudações
    if (lowerMessage.match(/\b(ol[aá]|oi|hey|e a[ií])\b/)) {
      return "E aí! 👋 Bora dominar essa fazenda? Pode perguntar sobre investimentos, dinheiro, riscos... Tô aqui pra isso!";
    }

    // Dinheiro e ganhos
    if (
      lowerMessage.match(/\b(dinheiro|grana|lucro|ganhar|rico|dinheirinho)\b/)
    ) {
      return "Sacou como funciona? 💰 Planta nas terras disponíveis! Alface é rápido mas rende pouco. Milho demora mais mas o retorno é maior. A chave é diversificar: planta um pouco de cada!";
    }

    // Investimentos
    if (lowerMessage.match(/\b(investir|investimento|aplicar|render)\b/)) {
      return "Boa pergunta! 📈 Investir na fazenda é tipo na vida real:\n\n• Alface = Poupança (seguro, pouco lucro)\n• Tomate = CDB (equilíbrio)\n• Milho = Ações (mais risco, mais retorno)\n\nO segredo? Nunca põe tudo num lugar só!";
    }

    // Riscos
    if (lowerMessage.match(/\b(risco|perder|perde|preju[ií]zo|arriscado)\b/)) {
      return "É isso aí! ⚠️ Todo investimento tem risco. Plantios longos podem dar problema, mas rendem mais. Por isso diversificar é fundamental - se um der ruim, você tem outros crescendo!";
    }

    // Diversificação
    if (lowerMessage.match(/\b(diversif|v[aá]rios|mix|mistur)\b/)) {
      return "Essa é a sacada! 🎯 Diversificar é NÃO colocar todos os ovos na mesma cesta.\n\nPlanta:\n• Alface → dinheiro rápido\n• Tomate → médio prazo  \n• Milho → longo prazo\n\nAssim sempre tem grana entrando!";
    }

    // Plantios específicos
    if (lowerMessage.match(/\b(alface|r[aá]pido|urgente)\b/)) {
      return "Alface é tipo sua reserva de emergência! 🥬 Cresce rápido (2-3 dias), lucro baixo mas é seguro. Perfeito quando você precisa de grana urgente!";
    }

    if (lowerMessage.match(/\b(tomate|m[ée]dio|equilibr)\b/)) {
      return "Tomate é o equilíbrio perfeito! 🍅 Crescimento médio (5-7 dias), lucro razoável. É tipo um CDB na vida real - nem muito arriscado, nem muito parado.";
    }

    if (lowerMessage.match(/\b(milho|longo|demor|paciên)\b/)) {
      return "Milho é pra quem tem paciência! 🌽 Demora mais (10-15 dias) mas o retorno é bem maior. É tipo investir em ações - mais arriscado, mas compensa se você souber esperar!";
    }

    // Como começar
    if (lowerMessage.match(/\b(come[çc]|inicio|iniciar|primeiro|fazer)\b/)) {
      return "Pra começar é tranquilo! 🚀\n\n1. Clica na terra vazia\n2. Escolhe o que plantar\n3. Espera crescer\n4. Colhe e vende!\n\nDica: Começa plantando um pouco de cada coisa. Assim você aprende como cada um funciona!";
    }

    // Estratégia
    if (lowerMessage.match(/\b(estrat[eé]g|melhor|dica|conselho)\b/)) {
      return "Vou te dar a estratégia campeã! 🏆\n\n• 40% em alface (segurança)\n• 30% em tomate (equilíbrio)\n• 30% em milho (crescimento)\n\nAssim você tem dinheiro entrando sempre, diversifica o risco e ainda cresce no longo prazo!";
    }

    // Ajuda geral
    if (lowerMessage.match(/\b(ajuda|help|socorro|d[uú]vida)\b/)) {
      return "Tô aqui pra te ajudar! 🤝 Posso explicar sobre:\n\n• Como ganhar dinheiro 💰\n• Estratégias de investimento 📊\n• Gerenciar riscos ⚠️\n• Diversificar plantios 🌱\n\nÉ só perguntar!";
    }

    // Resposta padrão (mais genérica mas útil)
    const defaultResponses = [
      "Interessante! 🤔 Cada plantio aqui ensina um conceito financeiro real. Planta um pouco de cada e vê como funciona na prática!",
      "Boa questão! 💡 Lembra: na fazenda e na vida real, paciência + diversificação = sucesso! O que mais você quer saber?",
      "Sacou o conceito? 🎓 Cada escolha aqui é igual escolher onde investir seu dinheiro. Rápido, médio ou longo prazo?",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  }
}

export default ChatScene;
