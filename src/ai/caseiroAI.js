// Sistema de IA do Caseiro - Educação Financeira
// Usando respostas inteligentes baseadas no contexto do jogador

class CaseiroAI {
  constructor() {
    console.log("🤖 Caseiro-IA inicializado com respostas inteligentes!");
  }

  async initialize() {
    // Não precisa mais de inicialização
    return Promise.resolve();
  }

  async generateQuestion(playerContext) {
    return this.getFallbackQuestion(playerContext);
  }

  getFallbackQuestion(playerContext) {
    const level = playerContext?.level || 1;
    const money = playerContext?.money || 0;

    const questions = [
      {
        question:
          "Você tem R$ 100 e quer investir. Qual a melhor estratégia no jogo?",
        options: [
          "A) Plantar só alface (rápido e seguro)",
          "B) Plantar só milho (demorado mas lucrativo)",
          "C) Diversificar: alface + tomate + milho",
          "D) Guardar o dinheiro sem plantar",
        ],
        correct: 2,
        explanation:
          "Diversificar é sempre mais seguro! Assim você tem renda rápida (alface), média (tomate) e alta (milho). Na vida real é igual: nunca coloque tudo em um investimento só.",
        difficulty: "easy",
        topic: "diversificação",
      },
      {
        question:
          "O que é mais importante ao escolher um investimento na fazenda?",
        options: [
          "A) Escolher sempre o que cresce mais rápido",
          "B) Equilibrar prazo, risco e retorno",
          "C) Investir tudo no que dá mais lucro",
          "D) Não investir nada",
        ],
        correct: 1,
        explanation:
          "Todo investimento tem 3 pilares: prazo, risco e retorno. Equilibrar os três é a chave!",
        difficulty: "medium",
        topic: "análise de investimentos",
      },
      {
        question:
          "Por que não devemos investir todo o dinheiro em um só plantio?",
        options: [
          "A) Porque é chato",
          "B) Para reduzir o risco de perder tudo",
          "C) Porque o jogo não deixa",
          "D) Não há problema nisso",
        ],
        correct: 1,
        explanation:
          "Se você planta só milho e vem uma praga, perde tudo. Diversificar reduz risco.",
        difficulty: "easy",
        topic: "gestão de risco",
      },
      {
        question: `Com R$ ${money.toFixed(
          2
        )}, como você planejaria seus investimentos?`,
        options: [
          "A) Gastar tudo em uma plantação grande",
          "B) Guardar 20% e investir 80%",
          "C) Investir tudo sem reserva",
          "D) Não fazer nada",
        ],
        correct: 1,
        explanation:
          "Reserva de emergência primeiro! Depois investir com calma.",
        difficulty: "medium",
        topic: "reserva de emergência",
      },
    ];

    const index = (level + (money > 500 ? 1 : 0)) % questions.length;
    return questions[index];
  }

  async chat(userMessage, playerContext) {
    return this.getFallbackChatResponse(userMessage);
  }

  getFallbackChatResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    const responses = {
      greeting: ["olá", "oi", "hey", "ola"],
      invest: ["investir", "investimento", "aplicar"],
      money: ["dinheiro", "ganhar", "grana", "lucro"],
      risk: ["risco", "perder", "seguro"],
      save: ["poupar", "guardar", "economizar"],
      help: ["ajuda", "socorro", "duvida", "dúvida"],
    };

    const replies = {
      greeting:
        "E aí! 👋 Bora dominar essa fazenda? Pode perguntar sobre investimentos, dinheiro, riscos... Tô aqui pra isso!",
      invest:
        "Investir é tipo plantar: você coloca grana hoje pra colher mais amanhã. 📈",
      money:
        "Pra ganhar grana, diversifica as plantações. Não põe tudo num lugar só. 💰",
      risk: "Risco sempre existe. A sacada é equilibrar plantios rápidos e longos. ⚖️",
      save: "Guardar dinheiro é essencial! Reserva te protege de imprevistos. 🛡️",
      help: "Tô aqui pra isso! Me pergunta sobre investimentos, dívida, juros... 💡",
    };

    for (const [key, keywords] of Object.entries(responses)) {
      if (keywords.some((k) => msg.includes(k))) return replies[key];
    }

    return "Boa! Cada escolha na fazenda ensina algo sobre finanças. 🚀";
  }
}

let caseiroAIInstance = null;

export function getCaseiroAI() {
  if (!caseiroAIInstance) caseiroAIInstance = new CaseiroAI();
  return caseiroAIInstance;
}

export default CaseiroAI;
