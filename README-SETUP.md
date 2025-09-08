# 🔧 Configuração de Segurança - API Keys

## ⚠️ IMPORTANTE: Configuração de Chaves de API

Este projeto foi configurado para **NÃO** incluir chaves de API hardcoded por questões de segurança.

### 📋 Passos para Configurar:

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Configure suas chaves de API no arquivo `.env`:**
   ```
   GROQ_API_KEY=sua_chave_groq_aqui
   ```

3. **Para o servidor backend, edite o arquivo `server/start.bat`:**
   ```batch
   set GROQ_API_KEY=sua_chave_groq_aqui
   ```

### 🔐 Obtendo a Chave Groq API:
1. Acesse: https://console.groq.com/
2. Faça login ou crie uma conta
3. Vá em "API Keys"
4. Crie uma nova chave
5. Copie e cole no arquivo `.env`

### ✅ Verificação:
- ✅ Arquivos `.env` estão no `.gitignore`
- ✅ Chaves de API removidas do código
- ✅ Repositório seguro para GitHub

**Nunca commite chaves de API no Git!**
