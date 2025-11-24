import { InferenceClient } from "@huggingface/inference";

// Buscar token de variável de ambiente (Vite)
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || "";

class CaseiroAI {
  constructor() {
    this.client = null;
    this.isLoading = false;
    this.isReady = false;

    this.model = "HuggingFaceTB/SmolLM2-1.7B-Instruct";
    this.maxRetries = 3;
  }

  async initialize() {
    if (this.isReady) return;

    // Se não houver token, retorna sem erro (vai usar fallback)
    if (!HF_TOKEN || HF_TOKEN.trim() === "") {
      console.log("ℹ️ Token HF não configurado. Usando respostas mock.");
      this.isReady = false;
      return; // Retorna sem erro
    }

    if (this.isLoading) return;

    try {
      this.isLoading = true;
      console.log("🤖 Conectando na IA online do Hugging Face...");
      this.client = new InferenceClient(HF_TOKEN);

      // warmup
      await this._textGen("oi", { max_new_tokens: 2, temperature: 0.1 });

      this.isReady = true;
      console.log("✅ IA online pronta!");
    } catch (error) {
      console.error("❌ Erro ao conectar com IA:", error.message);
      this.isReady = false;
      // Não lança o erro, apenas registra
    } finally {
      this.isLoading = false;
    }
  }

  async _textGen(prompt, parameters = {}) {
    let lastErr = null;

    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      try {
        const out = await this.client.textGeneration({
          model: this.model,
          inputs: prompt,
          parameters: {
            return_full_text: false,
            ...parameters,
          },
          options: { wait_for_model: true },
        });

        const text =
          (typeof out === "string" ? out : out?.generated_text) || "";
        return text.trim();
      } catch (err) {
        lastErr = err;
        const status =
          err?.response?.status || err?.status || err?.cause?.status;

        if (status === 503 || status === 429) {
          const delay = 800 * attempt;
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        throw err;
      }
    }

    throw lastErr;
  }

  getSystemPrompt(playerContext) {
    const contextStr = JSON.stringify(playerContext, null, 2);

    return `Você é o Professor Caseiro, o mentor financeiro da PoupaZenda, um professor brasileiro extremamente didático, paciente e motivador que fala como um jovem de 25-30 anos (gíria leve, tom leve, nunca pedante).

Sua única missão é ajudar o jogador a aprender educação financeira de forma personalizada, com base no contexto que receber.

Regras rígidas (nunca quebre nenhuma delas):
1. Sempre responda APENAS com um JSON válido, sem nenhum texto antes ou depois.
2. O JSON deve seguir exatamente este schema (não invente campos novos):
{
  "question": "string",
  "options": ["A) texto", "B) texto", "C) texto", "D) texto"],
  "correct": 0,
  "explanation": "string",
  "difficulty": "easy" | "medium" | "hard",
  "topic": "string"
}

Contexto do jogador:
${contextStr}

Crie UMA pergunta que ensine exatamente o conceito financeiro que esse jogador mais precisa aprender AGORA.
Seja direto, use exemplos reais do dia a dia brasileiro (Selic, IPCA, CDB, Tesouro) e termine a explicação sempre com tom positivo e encorajador.
Responda SEMPRE com JSON válido e NUNCA inclua markdown, código ou texto adicional.`;
  }

  async generateQuestion(playerContext) {
    if (!this.isReady) await this.initialize();

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const systemPrompt = this.getSystemPrompt(playerContext);

        const responseText = await this._textGen(systemPrompt, {
          max_new_tokens: 350,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        });

        const question = this.extractJSON(responseText);
        if (question) return this.validateQuestion(question);
      } catch (error) {
        if (attempt === this.maxRetries) {
          return this.getFallbackQuestion(playerContext);
        }
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }

    return this.getFallbackQuestion(playerContext);
  }

  extractJSON(text) {
    try {
      return JSON.parse(text);
    } catch {
      const withoutMarkdown = text.replace(/```json\n?|\n?```/g, "").trim();
      try {
        return JSON.parse(withoutMarkdown);
      } catch {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            return JSON.parse(jsonMatch[0]);
          } catch {}
        }
      }
    }
    return null;
  }

  validateQuestion(question) {
    const validOptions =
      Array.isArray(question?.options) &&
      question.options.length === 4 &&
      question.options.every((opt) => typeof opt === "string");

    const validCorrect =
      typeof question?.correct === "number" &&
      question.correct >= 0 &&
      question.correct <= 3;

    if (!validOptions || !validCorrect || !question.question) return null;

    return {
      question: String(question.question),
      options: question.options.map(String),
      correct: Number(question.correct),
      explanation: String(question.explanation || "Continue aprendendo!"),
      difficulty: ["easy", "medium", "hard"].includes(question.difficulty)
        ? question.difficulty
        : "medium",
      topic: String(question.topic || "educação financeira"),
    };
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
    if (!this.isReady) await this.initialize();

    try {
      const contextStr = JSON.stringify(playerContext);

      const chatPrompt = `Você é o Caseiro-IA, um mentor financeiro amigável do jogo PoupaZenda.
Responda de forma curta (máximo 2-3 frases), didática e motivadora.
Use gíria leve e exemplos do dia a dia brasileiro.

Contexto do jogador: ${contextStr}

Usuário: ${userMessage}
Caseiro-IA:`;

      const response = await this._textGen(chatPrompt, {
        max_new_tokens: 120,
        temperature: 0.8,
        top_p: 0.9,
        do_sample: true,
      });

      return response.length > 300
        ? response.substring(0, 297) + "..."
        : response;
    } catch {
      return this.getFallbackChatResponse(userMessage);
    }
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
