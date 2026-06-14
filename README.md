# JarvisBots - Plataforma SaaS de Robôs do WhatsApp

Bem-vindo à estrutura completa (Frontend e Banco de Dados Relacional) da plataforma SaaS para gerenciamento e criação de robôs de WhatsApp.

Este projeto contém a especificação física de banco de dados SQL e uma interface administrativa interativa (Dashboard em Dark Mode) construída com HTML, CSS e JS puros. A interface conta com um simulador completo integrado no frontend que emula um banco de dados via `localStorage` e permite simular o fluxo de escaneamento de QR Code e conversação em tempo real com os bots.

---

## 📂 Estrutura de Diretórios

```bash
PROJETO JARVIS/
├── database/
│   ├── schema.sql    # Estrutura DDL física do banco de dados relacional
│   └── queries.sql   # Consultas SQL CRUD mais comuns do SaaS
├── index.html        # Página web principal (Single-Page Application)
├── index.css         # Estilização visual Dark Mode & Glassmorphism
├── app.js            # Lógica interativa, simulação local e chat WhatsApp
└── README.md         # Documentação explicativa do projeto (Este arquivo)
```

---

## 🗄️ 1. Estrutura do Banco de Dados Relacional

As tabelas do banco de dados relacional foram modeladas com foco em integridade e otimização de busca. Veja as definições contidas em `database/schema.sql`:

### Tabela: `usuarios_clientes`
Responsável por gerenciar os assinantes da plataforma SaaS.
- `id` (SERIAL / Primary Key): Identificador único do cliente.
- `nome` (VARCHAR): Nome do assinante/empresa.
- `whatsapp` (VARCHAR): Celular com DDD do cliente (único e indexado).
- `status_assinatura` (VARCHAR): Estado contratual: `Ativo`, `Inativo` ou `Trial`.
- `limite_mensagens` (INT): Limite contratado de mensagens.
- `data_vencimento` (DATE): Data de expiração da assinatura.

### Tabela: `comandos_bot`
Armazena as palavras-gatilho globais configuradas e suas respostas.
- `id` (SERIAL / Primary Key): Identificador único do comando.
- `palavra_gatilho` (VARCHAR): O texto exato de ativação (ex: `/ajuda`, `/relatorio`). Indexado para busca rápida.
- `resposta_texto` (TEXT): A mensagem que o robô deve responder automaticamente.
- `acao_webhook` (VARCHAR): URL opcional para disparar automações externas (ex: n8n, Make).

### Tabela: `instancias_bots`
Registra as instâncias ativas e a personalidade de IA de cada bot vinculado a um usuário.
- `id_bot` (SERIAL / Primary Key): Identificador único da instância.
- `id_usuario` (INT / Foreign Key): Vinculado a `usuarios_clientes(id)` com cláusula `ON DELETE CASCADE`.
- `nome_do_bot` (VARCHAR): Identificador visual do robô.
- `prompt_de_personalidade` (TEXT): Instruções de sistema para a IA (System Prompt).
- `status_conexao` (VARCHAR): Situação da conexão com o WhatsApp: `Conectado`, `Desconectado`, ou `Aguardando QR Code`.

---

## 💻 2. Como Executar e Testar a Interface

Para ver a interface funcionando com o design premium Dark Mode e interações em tempo real, você não precisa configurar servidores de banco de dados locais. A lógica do frontend emula as tabelas do banco de dados relacional usando o `localStorage` do seu próprio navegador.

### Passo a Passo para Executar:
1. Navegue até a pasta do projeto.
2. Abra o arquivo `index.html` em qualquer navegador web moderno (ex: clicando duas vezes sobre o arquivo).
3. **Pronto!** A plataforma já carrega dados fictícios de teste para você interagir.

---

## 🛠️ 3. Recursos do Painel Administrativo

Ao abrir a plataforma, você pode navegar pelas seguintes abas no menu lateral:

1. **Painel Geral (Dashboard)**: Traz estatísticas da plataforma em tempo real (total de clientes cadastrados, faturamento simulado, uso total de mensagens e gráficos rápidos de contagem).
2. **Gestão de Usuários**: Uma tabela completa que permite:
   - Cadastrar novos clientes manualmente.
   - Editar planos, limites de mensagens e status contratuais.
   - Pesquisar clientes pelo nome ou telefone instantaneamente.
   - Excluir usuários (exclui automaticamente os bots vinculados).
3. **Gestão de Comandos**: Permite que você defina respostas dinâmicas no bot.
   - Adicione palavras-chave como `/ajuda` ou `/relatorio`.
   - Adicione uma URL de Webhook para disparar automações externas.
4. **Fábrica de Bots**: O local de criação dos robôs:
   - Clique em **"Gerar BOT de WhatsApp"** para abrir o modal.
   - Insira o nome, vincule a um cliente e digite o prompt de personalidade da IA.
   - Inicialize a instância. O card aparecerá com o status `Aguardando QR Code`.
   - Clique em **"Escanear QR Code"** para abrir a simulação interativa de pareamento do WhatsApp. Após 5 segundos na tela de scan, o status do bot mudará de forma animada para `Conectado`.
5. **Chat de Teste (WhatsApp Simulator)**:
   - Exclusivo para o administrador testar o robô antes do lançamento.
   - Selecione qualquer bot que esteja com o status `Conectado`.
   - Envie mensagens e veja as respostas instantâneas:
     - Digitar um gatilho configurado (ex: `/ajuda`) fará o bot responder o texto do comando e simular o disparo de webhook.
     - Digitar qualquer outra mensagem simulará uma resposta automática gerada por Inteligência Artificial integrada, respeitando as instruções descritas no **Prompt de Personalidade** do robô!
