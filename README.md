# 🌱 PoupaZenda - Jogo Educativo de Educação Financeira

![Status](https://img.shields.io/badge/status-ativo-success)
![Licença](https://img.shields.io/badge/licença-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)

Um jogo educativo de simulação de fazenda que ensina conceitos de educação financeira de forma divertida e interativa, com auxílio de IA.

## 🎮 Sobre o Jogo

**PoupaZenda** é um jogo onde você gerencia uma fazenda virtual e aprende conceitos reais de educação financeira através do gameplay. Cada plantio representa um tipo diferente de investimento:

- 🥬 **Alface** → Investimentos de curto prazo (baixo risco, retorno rápido)
- 🍅 **Tomate** → Investimentos de médio prazo (risco moderado, retorno equilibrado)
- 🌽 **Milho** → Investimentos de longo prazo (maior risco, maior retorno)

### 🤖 Caseiro-IA - Seu Mentor Financeiro

O jogo conta com o **Caseiro-IA**, um assistente inteligente que:

- Responde dúvidas sobre educação financeira
- Explica conceitos de investimento
- Dá dicas personalizadas baseadas no seu progresso
- Usa linguagem jovem e acessível

## 🚀 Como Executar o Jogo

### Pré-requisitos

Certifique-se de ter instalado em seu sistema:

- **Node.js** (versão 18 ou superior) - [Download aqui](https://nodejs.org/)
- **npm** (geralmente vem com o Node.js)
- **Git** (opcional, para clonar o repositório)

### Passo 1: Instalação

Clone o repositório (ou baixe o ZIP):

```bash
git clone https://github.com/Kaian-Moura/kameka.git
cd kameka
```

Instale as dependências:

```bash
npm install
```

### Passo 2: Executar em Modo Desenvolvimento

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

O jogo estará disponível em:

```
http://localhost:5173
```

O servidor Vite oferece:

- ✨ Hot Module Replacement (HMR) - atualizações automáticas
- ⚡ Carregamento ultra-rápido
- 🔧 Modo de desenvolvimento otimizado

### Passo 3: Build para Produção (Opcional)

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

Para testar o build de produção localmente:

```bash
npm run preview
```

## 🎯 Como Jogar

1. **Splash Screen**: Clique em "Jogar" para começar
2. **Gerenciar Fazenda**:
   - Clique nas terras vazias para plantar
   - Escolha entre alface, tomate ou milho
   - Espere o crescimento e colha quando estiver pronto
3. **Chat com Caseiro-IA**:
   - Clique no botão de chat no HUD
   - Faça perguntas sobre finanças e investimentos
   - Aprenda conceitos reais enquanto joga

## 🤖 Configuração da IA (Opcional)

Por padrão, o jogo funciona com **respostas mock inteligentes**. Para ativar a IA real do Hugging Face:

### 1. Obter Token do Hugging Face

1. Crie uma conta em [huggingface.co](https://huggingface.co/)
2. Vá em **Settings → Access Tokens**
3. Crie um novo token (tipo "read")
4. Copie o token gerado

### 2. Configurar Variável de Ambiente (SEGURO ✅)

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione seu token:

```env
VITE_HF_TOKEN=seu_token_aqui
```

**✅ SEGURO**: O arquivo `.env` está no `.gitignore` e nunca será commitado!

**⚠️ NUNCA** coloque tokens diretamente no código fonte.

### 3. Reiniciar o Servidor

```bash
# Pare o servidor (Ctrl+C) e execute novamente
npm run dev
```

Agora o Caseiro-IA usará o modelo **SmolLM2-1.7B-Instruct** do Hugging Face para respostas personalizadas em tempo real!

## 📁 Estrutura do Projeto

```
kameka/
├── src/
│   ├── ai/
│   │   └── caseiroAI.js          # Sistema de IA do jogo
│   ├── scenes/
│   │   ├── SplashScene.js        # Tela inicial
│   │   ├── GameScene.js          # Cena principal do jogo
│   │   ├── ChatScene.js          # Interface de chat com IA
│   │   └── ShopScene.js          # Loja do jogo
│   ├── main.js                   # Configuração do Phaser
│   └── index.html                # HTML da aplicação
├── assets/
│   ├── hud/                      # Elementos da interface
│   └── prototipo/                # Assets de protótipo
├── package.json
├── vite.config.js                # Configuração do Vite
└── README.md
```

## 🛠️ Tecnologias Utilizadas

- **[Phaser 3](https://phaser.io/)** - Framework para jogos HTML5
- **[Vite](https://vitejs.dev/)** - Build tool e dev server
- **[Hugging Face Inference](https://huggingface.co/)** - API de IA
- **JavaScript (ES6+)** - Linguagem principal
- **HTML5 Canvas** - Renderização gráfica

## 🎓 Conceitos de Educação Financeira Ensinados

- 💰 **Diversificação de investimentos**
- ⏱️ **Relação risco x retorno**
- 📊 **Planejamento financeiro de curto, médio e longo prazo**
- 🛡️ **Reserva de emergência**
- 📈 **Análise de investimentos**
- 💡 **Tomada de decisão financeira**

 ## 🎥 Vídeo de Demonstração

Assista ao vídeo demonstrativo do jogo:

🔗 https://drive.google.com/drive/folders/1LU5iTXbA1DST3CHw1oTcyt-879XPq81k

## 🐛 Solução de Problemas

### Erro: "Cannot find module"

```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

### IA não está respondendo

- Verifique se o token do Hugging Face está configurado corretamente
- O jogo funciona normalmente sem IA (modo mock)
- Verifique o console do navegador (F12) para logs

## 📝 Scripts Disponíveis

| Comando           | Descrição                              |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Inicia servidor de desenvolvimento     |
| `npm run build`   | Cria build de produção                 |
| `npm run preview` | Visualiza build de produção localmente |

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🌟 Agradecimentos

- Phaser.js pela excelente framework de jogos
- Hugging Face pela API de IA acessível
- Comunidade open source

---

**Desenvolvido com 💚 para ensinar educação financeira de forma divertida!**

Para mais informações, consulte o [GUIA_RAPIDO.md](GUIA_RAPIDO.md).
