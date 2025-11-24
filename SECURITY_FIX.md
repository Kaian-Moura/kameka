# 🔒 INSTRUÇÕES PARA REMOVER TOKEN DO GIT

## ⚠️ PROBLEMA

O GitHub bloqueou o push porque detectou um token do Hugging Face no histórico do git.

## ✅ SOLUÇÃO

### Opção 1: Reescrever o Último Commit (Mais Simples)

Se o token estava apenas no último commit:

```bash
# 1. Verificar os arquivos modificados
git status

# 2. Adicionar as correções (caseiroAI.js com variável de ambiente)
git add src/ai/caseiroAI.js .env.example .gitignore README.md

# 3. Fazer novo commit
git commit -m "security: remove hardcoded HF token, use environment variables"

# 4. Forçar push (sobrescreve o commit com token)
git push origin main --force
```

### Opção 2: Remover Token do Histórico Completo (Se necessário)

Se o token está em vários commits antigos:

```bash
# 1. Instalar BFG Repo-Cleaner (recomendado)
# Baixe em: https://rtyley.github.io/bfg-repo-cleaner/

# 2. Criar arquivo com strings a remover
echo "seu_token_aqui" > tokens.txt

# 3. Limpar repositório
java -jar bfg.jar --replace-text tokens.txt

# 4. Forçar push
git push origin main --force
```

### Opção 3: Aceitar o Token Bloqueado (GitHub)

Se você já **revogou o token** no Hugging Face:

1. Acesse o link fornecido pelo GitHub:

   ```
   https://github.com/Kaian-Moura/kameka/security/secret-scanning/unblock-secret/35vbsD8AZT3nwEbWc53nCOrcG2W
   ```

2. Clique em "Allow secret" depois de revogar o token

3. Faça push novamente

## 🔐 IMPORTANTE: Revogar o Token Exposto

**SEMPRE revogue tokens expostos:**

1. Vá em https://huggingface.co/settings/tokens
2. Encontre o token que foi exposto
3. Clique em "Delete" ou "Revoke"
4. Gere um novo token
5. Configure no arquivo `.env` (não no código!)

## ✨ BOAS PRÁTICAS

✅ **FAÇA:**

- Use variáveis de ambiente (`.env`)
- Mantenha `.env` no `.gitignore`
- Use `.env.example` para documentar
- Revogue tokens expostos imediatamente

❌ **NÃO FAÇA:**

- Nunca coloque tokens no código fonte
- Nunca faça commit de arquivos `.env`
- Nunca compartilhe tokens em público

## 🚀 APÓS RESOLVER

1. Verifique se o arquivo `.env` está listado no `.gitignore` ✅
2. Verifique se `caseiroAI.js` usa `import.meta.env.VITE_HF_TOKEN` ✅
3. Crie seu arquivo `.env` local com o novo token
4. Faça commit das mudanças seguras
5. Force push se necessário

## 📚 REFERÊNCIAS

- [GitHub Push Protection](https://docs.github.com/code-security/secret-scanning/working-with-secret-scanning-and-push-protection)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
