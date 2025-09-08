# ConsultIA - Plataforma de Consultoria Empresarial com IA

Plataforma web para Micro e Pequenas Empresas (MPE) que oferece consultoria empresarial através de especialistas virtuais em IA.

## 🚀 Funcionalidades

- **29 Especialistas em IA** distribuídos em 6 categorias
- **Chat Personalizado** baseado no perfil da empresa
- **Dashboard Interativo** com métricas e acompanhamento
- **Sistema de Metas** para objetivos empresariais
- **Persistência Local** de dados e conversas

## 🔧 Tecnologias

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- OpenAI API (GPT-3.5-turbo)
- LocalStorage para persistência

## ⚙️ Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar OpenAI API Key
- Acesse [platform.openai.com](https://platform.openai.com)
- Crie uma conta e gere uma API key
- Na primeira execução da aplicação, será solicitada a configuração

### 3. Executar Aplicação
```bash
npm run dev
```

## 🎯 Categorias de Especialistas

### Vendas (5 especialistas)
- Prospecção B2B, Roteiros consultivos, CRM, Negociação, Upsell

### Marketing (4 especialistas)  
- Funis digitais, Anúncios pagos, Redes sociais, E-mail marketing

### Pessoas (5 especialistas)
- Formação, Recrutamento, Cultura organizacional, Feedbacks

### Processos (5 especialistas)
- Mapeamento, Lean/Kaizen, Automação, Qualidade ISO, Metodologias ágeis

### Finanças (5 especialistas)
- Planejamento, Fluxo de caixa, Custos, Orçamento, Indicadores

### Estratégia (5 especialistas)
- Planejamento estratégico, Análise de mercado, Inovação, Governança, OKRs

## 💡 Como Usar

1. **Configure sua API key** na primeira execução
2. **Cadastre o perfil** da sua empresa
3. **Escolha uma categoria** de consultoria
4. **Selecione um especialista** para conversar
5. **Inicie o chat** e receba consultoria personalizada

## 🔒 Segurança

- API key armazenada localmente (criptografada)
- Dados da empresa mantidos no navegador
- Conversas privadas e seguras

## 📊 Arquitetura da IA

**Uma única API key** gerencia todos os 29 especialistas através de:
- **Prompts personalizados** por especialista
- **Contexto da empresa** injetado automaticamente
- **Personalidades distintas** para cada consultor
- **Respostas específicas** por área de atuação

## 🚀 Próximas Melhorias

- [ ] Backend com banco de dados
- [ ] Autenticação de usuários
- [ ] Responsividade mobile
- [ ] Relatórios exportáveis
- [ ] Integração com ferramentas externas
