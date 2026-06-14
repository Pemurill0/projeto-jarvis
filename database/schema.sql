-- ==========================================
-- ESTRUTURA DO BANCO DE DADOS (MODELAGEM RELACIONAL)
-- Sistema SaaS para gerenciamento e criação de robôs de WhatsApp
-- Compatible with PostgreSQL / MySQL
-- ==========================================

-- Tabela: usuarios_clientes
-- Gerencia as contas dos clientes que utilizam a plataforma SaaS.
CREATE TABLE usuarios_clientes (
    id SERIAL PRIMARY KEY, -- Identificador único do cliente
    nome VARCHAR(150) NOT NULL, -- Nome completo ou razão social
    whatsapp VARCHAR(20) NOT NULL UNIQUE, -- Número de WhatsApp (formato DDI + DDD + Número)
    status_assinatura VARCHAR(20) DEFAULT 'Trial' CHECK (status_assinatura IN ('Ativo', 'Inativo', 'Trial')), -- Situação financeira/contratual
    limite_mensagens INT DEFAULT 1000, -- Limite de mensagens mensais contratado
    data_vencimento DATE NOT NULL, -- Data de expiração da assinatura atual
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Registro de quando o cliente foi criado
);

-- Tabela: comandos_bot
-- Armazena comandos pré-definidos pelos administradores do sistema.
CREATE TABLE comandos_bot (
    id SERIAL PRIMARY KEY, -- Identificador único do comando
    palavra_gatilho VARCHAR(50) NOT NULL UNIQUE, -- Palavra-chave que dispara a ação (ex: '/ajuda', '/relatorio')
    resposta_texto TEXT, -- Resposta em texto estático que o bot deve enviar
    acao_webhook VARCHAR(255), -- URL do webhook para disparar automações externas se o comando for acionado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Registro de criação do comando
);

-- Tabela: instancias_bots
-- Registra as instâncias de bots criadas e vinculadas aos clientes.
CREATE TABLE instancias_bots (
    id_bot SERIAL PRIMARY KEY, -- Identificador único da instância de bot
    id_usuario INT NOT NULL, -- ID do usuário cliente que é o dono do robô (chave estrangeira)
    nome_do_bot VARCHAR(100) NOT NULL, -- Nome identificador do bot (ex: 'Atendimento Vendas')
    prompt_de_personalidade TEXT NOT NULL, -- Instruções do sistema/personalidade da IA
    status_conexao VARCHAR(30) DEFAULT 'Desconectado' CHECK (status_conexao IN ('Conectado', 'Desconectado', 'Aguardando QR Code')), -- Status atual da conexão com o WhatsApp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Registro de criação do bot
    
    -- Restrição de Integridade Referencial (Chave Estrangeira)
    CONSTRAINT fk_usuario_bot FOREIGN KEY (id_usuario) 
        REFERENCES usuarios_clientes(id) 
        ON DELETE CASCADE
);

-- Tabela: participantes_grupo
-- Armazena os participantes de cada grupo (bot) e suas estatísticas locais no grupo.
CREATE TABLE participantes_grupo (
    id SERIAL PRIMARY KEY,
    id_bot INT NOT NULL, -- Instância do bot associada ao grupo
    nome VARCHAR(100) NOT NULL, -- Nome de exibição do participante
    whatsapp VARCHAR(20) NOT NULL, -- Número de telefone
    cargo VARCHAR(50) DEFAULT 'Membro' CHECK (cargo IN ('Administrador', 'Membro')), -- Cargo do participante no grupo
    mensagens_enviadas INT DEFAULT 0, -- Estatística: mensagens enviadas
    reacoes_recebidas INT DEFAULT 0, -- Estatística: reações recebidas
    advertencias INT DEFAULT 0, -- Estatística: quantidade de advertências
    bio TEXT, -- Texto de biografia
    foto_url TEXT, -- URL da foto de perfil
    aniversario_dia INT CHECK (aniversario_dia BETWEEN 1 AND 31), -- Dia de nascimento
    aniversario_mes INT CHECK (aniversario_mes BETWEEN 1 AND 12), -- Mês de nascimento
    instagram VARCHAR(100), -- Nome de usuário do Instagram (@usuario)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bot_participante FOREIGN KEY (id_bot)
        REFERENCES instancias_bots(id_bot) ON DELETE CASCADE
);

-- Tabela: roles_grupo
-- Gerencia os rolês/eventos informais organizados no grupo.
CREATE TABLE roles_grupo (
    id SERIAL PRIMARY KEY,
    id_bot INT NOT NULL, -- Instância do bot associada ao grupo
    codigo VARCHAR(10) NOT NULL UNIQUE, -- Código identificador (Ex: 'ROL-942')
    descricao TEXT NOT NULL, -- Descrição ou convite do rolê
    imagem_url TEXT, -- Imagem de divulgação opcional
    data_hora TIMESTAMP, -- Data e hora do rolê
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bot_role FOREIGN KEY (id_bot)
        REFERENCES instancias_bots(id_bot) ON DELETE CASCADE
);

-- Tabela: agendamentos_grupo
-- Gerencia as automações e mensagens/comandos agendados no grupo.
CREATE TABLE agendamentos_grupo (
    id SERIAL PRIMARY KEY,
    id_bot INT NOT NULL, -- Instância do bot associada ao grupo
    codigo VARCHAR(10) NOT NULL UNIQUE, -- Código do agendamento (Ex: 'AGD-129')
    tipo_agendamento VARCHAR(50) NOT NULL CHECK (tipo_agendamento IN ('Único', 'Diário', 'Semanal', 'Mensal', 'Anual')),
    mensagem TEXT NOT NULL, -- Mensagem de texto ou comando a ser disparado
    data_hora_execucao TIMESTAMP NOT NULL, -- Próxima data/hora de execução
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bot_agendamento FOREIGN KEY (id_bot)
        REFERENCES instancias_bots(id_bot) ON DELETE CASCADE
);

-- Índices recomendados para otimização de consultas
CREATE INDEX idx_usuario_whatsapp ON usuarios_clientes(whatsapp);
CREATE INDEX idx_comando_gatilho ON comandos_bot(palavra_gatilho);
CREATE INDEX idx_instancia_usuario ON instancias_bots(id_usuario);
CREATE INDEX idx_participante_niver ON participantes_grupo(aniversario_mes, aniversario_dia);
CREATE INDEX idx_participante_whatsapp ON participantes_grupo(id_bot, whatsapp);
CREATE INDEX idx_role_codigo ON roles_grupo(codigo);
CREATE INDEX idx_agendamento_data ON agendamentos_grupo(data_hora_execucao);
