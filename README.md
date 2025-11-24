# 🌱 PoupaZenda - Jogo Educativo de Educação Financeira

![Status](https://img.shields.io/badge/status-ativo-success)
![Licença](https://img.shields.io/badge/licença-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)

Um jogo educativo de simulação de fazenda que ensina conceitos de educação financeira de forma divertida e interativa, com auxílio de IA.

## 👥 Integrantes - Kameka

- [Kaian Santos Moura](https://www.linkedin.com/in/kaian-moura-56b8871b4/)

- [Karol Rocha Barbosa](https://www.linkedin.com/in/karolbarbosarocha/)

- [Messias Fernandes de Olivindo](https://www.linkedin.com/in/messias-olivindo/)

## 🎮 Sobre o Jogo

**PoupaZenda** é um jogo onde você gerencia uma fazenda virtual e aprende conceitos reais de educação financeira através do gameplay. Cada plantio representa um tipo diferente de investimento.

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

## 🚀 Deploy no GitHub Pages

O projeto está configurado para deploy automático no GitHub Pages.

### Configuração Inicial

1. Acesse o repositório no GitHub
2. Vá em **Settings** → **Pages**
3. Em **Source**, selecione: **GitHub Actions**
4. Faça push das suas alterações
5. O GitHub Actions fará o build e deploy automaticamente

Após o deploy, o jogo estará disponível em:
```
https://kaian-moura.github.io/kameka/
```

### Verificar o Deploy

- Acompanhe o progresso na aba **Actions** do GitHub
- Aguarde o workflow "Deploy to GitHub Pages" concluir
- O jogo estará online em alguns minutos

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
