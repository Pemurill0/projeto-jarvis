-- ==========================================
-- CONSULTAS SQL PRINCIPAIS DA PLATAFORMA
-- Operações do Dashboard SaaS de Bots de WhatsApp
-- ==========================================

-- ==========================================
-- 1. GESTÃO DE CLIENTES (usuarios_clientes)
-- ==========================================

-- Listar todos os clientes cadastrados (ordenados por data de criação)
SELECT id, nome, whatsapp, status_assinatura, limite_mensagens, data_vencimento, created_at 
FROM usuarios_clientes
ORDER BY created_at DESC;

-- Buscar cliente por WhatsApp
SELECT id, nome, whatsapp, status_assinatura, limite_mensagens, data_vencimento 
FROM usuarios_clientes 
WHERE whatsapp = :whatsapp_procurado;

-- Cadastrar novo cliente manualmente
INSERT INTO usuarios_clientes (nome, whatsapp, status_assinatura, limite_mensagens, data_vencimento)
VALUES (:nome, :whatsapp, :status_assinatura, :limite_mensagens, :data_vencimento);

-- Atualizar plano/limite e dados cadastrais de um cliente
UPDATE usuarios_clientes
SET nome = :nome,
    whatsapp = :whatsapp,
    status_assinatura = :status_assinatura,
    limite_mensagens = :limite_mensagens,
    data_vencimento = :data_vencimento
WHERE id = :id;

-- Obter resumo financeiro e estatísticas de uso (Dashboard Geral)
SELECT 
    COUNT(*) as total_clientes,
    SUM(CASE WHEN status_assinatura = 'Ativo' THEN 1 ELSE 0 END) as clientes_ativos,
    SUM(CASE WHEN status_assinatura = 'Trial' THEN 1 ELSE 0 END) as clientes_trial,
    SUM(CASE WHEN status_assinatura = 'Inativo' THEN 1 ELSE 0 END) as clientes_inativos,
    SUM(limite_mensagens) as limite_mensagens_total
FROM usuarios_clientes;

-- Excluir cliente do sistema (Nota: as instâncias de bots vinculadas serão removidas por causa de CASCADE)
DELETE FROM usuarios_clientes 
WHERE id = :id;


-- ==========================================
-- 2. GESTÃO DE COMANDOS (comandos_bot)
-- ==========================================

-- Listar todos os comandos configurados no sistema
SELECT id, palavra_gatilho, resposta_texto, acao_webhook, created_at 
FROM comandos_bot
ORDER BY palavra_gatilho ASC;

-- Criar novo comando de bot
INSERT INTO comandos_bot (palavra_gatilho, resposta_texto, acao_webhook)
VALUES (:palavra_gatilho, :resposta_texto, :acao_webhook);

-- Atualizar comando existente
UPDATE comandos_bot
SET palavra_gatilho = :palavra_gatilho,
    resposta_texto = :resposta_texto,
    acao_webhook = :acao_webhook
WHERE id = :id;

-- Buscar resposta e webhook correspondente ao receber uma palavra-gatilho no WhatsApp
SELECT resposta_texto, acao_webhook 
FROM comandos_bot 
WHERE palavra_gatilho = :mensagem_recebida_gatilho;

-- Excluir um comando
DELETE FROM comandos_bot 
WHERE id = :id;


-- ==========================================
-- 3. FÁBRICA DE BOTS (instancias_bots)
-- ==========================================

-- Listar todos os bots cadastrados trazendo dados do proprietário (JOIN)
SELECT 
    b.id_bot,
    b.nome_do_bot,
    b.prompt_de_personalidade,
    b.status_conexao,
    b.created_at,
    u.id as id_usuario,
    u.nome as nome_proprietario,
    u.whatsapp as whatsapp_proprietario
FROM instancias_bots b
INNER JOIN usuarios_clientes u ON b.id_usuario = u.id
ORDER BY b.created_at DESC;

-- Registrar nova instância de Bot para um cliente
INSERT INTO instancias_bots (id_usuario, nome_do_bot, prompt_de_personalidade, status_conexao)
VALUES (:id_usuario, :nome_do_bot, :prompt_de_personalidade, 'Aguardando QR Code');

-- Atualizar o status de conexão de uma instância de bot (ex: ao ler o QR Code ou desconectar)
UPDATE instancias_bots
SET status_conexao = :novo_status
WHERE id_bot = :id_bot;

-- Atualizar prompt de personalidade de um bot
UPDATE instancias_bots
SET nome_do_bot = :nome_do_bot,
    prompt_de_personalidade = :prompt_de_personalidade
WHERE id_bot = :id_bot;

-- Obter contagem de bots por status de conexão
SELECT 
    status_conexao, 
    COUNT(*) as total 
FROM instancias_bots 
GROUP BY status_conexao;

-- Remover uma instância de bot
DELETE FROM instancias_bots 
WHERE id_bot = :id_bot;


-- ==========================================
-- 4. GESTÃO E CONSULTAS DE PARTICIPANTES DO GRUPO
-- ==========================================

-- Obter dados estatísticos de um participante (.meusdados)
SELECT nome, whatsapp, cargo, mensagens_enviadas, reacoes_recebidas, advertencias, bio, foto_url, instagram, aniversario_dia, aniversario_mes
FROM participantes_grupo
WHERE id_bot = :id_bot AND whatsapp = :whatsapp_participante;

-- Incrementar contagem de mensagens enviadas
UPDATE participantes_grupo
SET mensagens_enviadas = mensagens_enviadas + 1
WHERE id_bot = :id_bot AND whatsapp = :whatsapp_participante;

-- Incrementar contagem de reações recebidas
UPDATE participantes_grupo
SET reacoes_recebidas = reacoes_recebidas + 1
WHERE id_bot = :id_bot AND whatsapp = :whatsapp_participante;

-- Configurar Biografia e Foto (.bio)
UPDATE participantes_grupo
SET bio = :bio,
    foto_url = :foto_url
WHERE id_bot = :id_bot AND whatsapp = :whatsapp_participante;

-- Configurar Aniversário (.niver)
UPDATE participantes_grupo
SET aniversario_dia = :dia,
    aniversario_mes = :mes
WHERE id_bot = :id_bot AND whatsapp = :whatsapp_participante;

-- Remover Aniversário (.niver.excluir)
UPDATE participantes_grupo
SET aniversario_dia = NULL,
    aniversario_mes = NULL
WHERE id_bot = :id_bot AND whatsapp = :whatsapp_participante;

-- Listar aniversariantes do dia (.nivers hoje)
SELECT nome, whatsapp, cargo, aniversario_dia, aniversario_mes
FROM participantes_grupo
WHERE id_bot = :id_bot AND aniversario_dia = :dia_atual AND aniversario_mes = :mes_atual;

-- Listar aniversariantes do mês (.nivers)
SELECT nome, whatsapp, cargo, aniversario_dia, aniversario_mes
FROM participantes_grupo
WHERE id_bot = :id_bot AND aniversario_mes = :mes_atual
ORDER BY aniversario_dia ASC;

-- Listar todos os aniversariantes cadastrados ordenados (.nivers ano)
SELECT nome, whatsapp, cargo, aniversario_dia, aniversario_mes
FROM participantes_grupo
WHERE id_bot = :id_bot AND aniversario_dia IS NOT NULL
ORDER BY aniversario_mes ASC, aniversario_dia ASC;

-- Configurar Instagram (.ig @user)
UPDATE participantes_grupo
SET instagram = :instagram
WHERE id_bot = :id_bot AND whatsapp = :whatsapp_participante;

-- Remover Instagram (.ig.excluir)
UPDATE participantes_grupo
SET instagram = NULL
WHERE id_bot = :id_bot AND whatsapp = :whatsapp_participante;

-- Listar todos os Instagrams cadastrados no grupo (.ig sem parâmetros)
SELECT nome, instagram 
FROM participantes_grupo
WHERE id_bot = :id_bot AND instagram IS NOT NULL AND instagram <> '';


-- ==========================================
-- 5. GESTÃO DE ROLÊS (EVENTOS DO GRUPO)
-- ==========================================

-- Criar um novo rolê (.role.criar)
INSERT INTO roles_grupo (id_bot, codigo, descricao, imagem_url, data_hora)
VALUES (:id_bot, :codigo, :descricao, :imagem_url, :data_hora);

-- Alterar um rolê (.role.alterar)
UPDATE roles_grupo
SET descricao = :nova_descricao
WHERE id_bot = :id_bot AND (codigo = :codigo OR id = :id_cuidado);

-- Excluir um rolê (.role.excluir)
DELETE FROM roles_grupo
WHERE id_bot = :id_bot AND (codigo = :codigo OR id = :id_cuidado);

-- Listar rolês ativos/futuros do grupo
SELECT codigo, descricao, imagem_url, data_hora 
FROM roles_grupo
WHERE id_bot = :id_bot
ORDER BY data_hora ASC;


-- ==========================================
-- 6. AUTOMAÇÕES (AGENDAMENTOS)
-- ==========================================

-- Cadastrar novo agendamento (.agendar.*)
INSERT INTO agendamentos_grupo (id_bot, codigo, tipo_agendamento, mensagem, data_hora_execucao)
VALUES (:id_bot, :codigo, :tipo_agendamento, :mensagem, :data_hora_execucao);

-- Listar agendamentos ativos do grupo (.agendamentos)
SELECT codigo, tipo_agendamento, mensagem, data_hora_execucao
FROM agendamentos_grupo
WHERE id_bot = :id_bot
ORDER BY data_hora_execucao ASC;

-- Remover agendamento da fila (.agendamento.excluir)
DELETE FROM agendamentos_grupo
WHERE id_bot = :id_bot AND codigo = :codigo;

-- Selecionar agendamentos pendentes de execução
SELECT id, id_bot, codigo, tipo_agendamento, mensagem, data_hora_execucao
FROM agendamentos_grupo
WHERE data_hora_execucao <= CURRENT_TIMESTAMP;

-- Atualizar próxima execução para agendamento recorrente
UPDATE agendamentos_grupo
SET data_hora_execucao = :nova_data_hora
WHERE id = :id;
