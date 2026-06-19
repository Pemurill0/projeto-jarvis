/* ==========================================
   APP LOGIC - PLATAFORMA SAAS WHATSAPP BOT
   Banco de Dados Local (localStorage) e Simulador
   Com sistema anti-ban, toasts e dashboard rico
   ========================================== */

// --------------------------------------------------
// 1. ESTRUTURA DE DADOS INICIAIS (SEED DATA)
// --------------------------------------------------
const DEFAULT_CLIENTS = [
    { id: 1, nome: "Pedro Henrique Vídeos", whatsapp: "5511999998888", status_assinatura: "Ativo", limite_mensagens: 10000, data_vencimento: "2026-12-31" },
    { id: 2, nome: "Maria Clara Estética", whatsapp: "5521988887777", status_assinatura: "Trial", limite_mensagens: 1000, data_vencimento: "2026-06-25" },
    { id: 3, nome: "Lucas Souza Tech", whatsapp: "5531977776666", status_assinatura: "Inativo", limite_mensagens: 5000, data_vencimento: "2026-05-10" }
];

const DEFAULT_COMMANDS = [
    { id: 1, palavra_gatilho: "/ajuda", resposta_texto: "Olá! Como posso te ajudar? Digite uma das opções:\n1. Falar com atendente\n2. Ver nossos planos\n3. Cancelar assinatura", acao_webhook: "" },
    { id: 2, palavra_gatilho: "/relatorio", resposta_texto: "Seu relatório de mensagens foi gerado com sucesso pelo bot e enviado para o painel principal.", acao_webhook: "https://n8n.exemplo.com/webhook/disparar-relatorio" },
    { id: 3, palavra_gatilho: "/link", resposta_texto: "Aqui está o link para acesso ao nosso portal financeiro: https://jarvisbots.com/financeiro", acao_webhook: "" },
    { id: 4, palavra_gatilho: ".meusdados", resposta_texto: "Retorna as estatísticas do participante no grupo (mensagens enviadas, reações, advertências, instagram, aniversário, signo).", acao_webhook: "" },
    { id: 5, palavra_gatilho: ".bio", resposta_texto: "Exibe ou atualiza sua biografia/foto de perfil no grupo. Uso: .bio <texto> ou .bio foto <URL>.", acao_webhook: "" },
    { id: 6, palavra_gatilho: ".niver", resposta_texto: "Configura seu aniversário no grupo. Uso: .niver DD/MM.", acao_webhook: "" },
    { id: 7, palavra_gatilho: ".niver.excluir", resposta_texto: "Exclui seu aniversário da lista do grupo.", acao_webhook: "" },
    { id: 8, palavra_gatilho: ".nivers", resposta_texto: "Lista os aniversariantes. Uso: .nivers (mês atual), .nivers hoje (hoje), .nivers ano (ano todo).", acao_webhook: "" },
    { id: 9, palavra_gatilho: ".signos", resposta_texto: "Lista a relação de signos do zodíaco dos integrantes do grupo que cadastraram aniversário.", acao_webhook: "" },
    { id: 10, palavra_gatilho: ".ig", resposta_texto: "Exibe os Instagrams cadastrados ou cadastra o seu. Uso: .ig ou .ig @usuario.", acao_webhook: "" },
    { id: 11, palavra_gatilho: ".ig.excluir", resposta_texto: "Remove seu Instagram da lista do grupo.", acao_webhook: "" },
    { id: 12, palavra_gatilho: ".role.criar", resposta_texto: "Cria um novo evento/rolê no grupo. Uso: .role.criar <descrição> [data: DD/MM/AAAA HH:MM] [imagem: URL].", acao_webhook: "" },
    { id: 13, palavra_gatilho: ".role.alterar", resposta_texto: "Altera a descrição de um rolê. Uso: .role.alterar <código> <nova descrição> ou cite o evento e digite .role.alterar <nova descrição>.", acao_webhook: "" },
    { id: 14, palavra_gatilho: ".role.excluir", resposta_texto: "Exclui um rolê do grupo pelo código. Uso: .role.excluir <código>.", acao_webhook: "" },
    { id: 15, palavra_gatilho: ".agendamentos", resposta_texto: "Lista todos os agendamentos de mensagens ativos do grupo.", acao_webhook: "" },
    { id: 16, palavra_gatilho: ".agendamento.excluir", resposta_texto: "Remove um agendamento do grupo pelo código. Uso: .agendamento.excluir <código>.", acao_webhook: "" }
];

const DEFAULT_BOTS = [
    { id_bot: 1, id_usuario: 1, nome_do_bot: "Jarvis", prompt_de_personalidade: "Você é o Jarvis, assistente virtual inteligente da plataforma. Seja sempre educado, prestativo e ajude os usuários com seus comandos.", status_conexao: "Conectado" },
    { id_bot: 2, id_usuario: 2, nome_do_bot: "Suporte Técnico", prompt_de_personalidade: "Você é o suporte técnico do sistema de estética. Ajude a agendar horários, explique os procedimentos e seja paciente.", status_conexao: "Aguardando QR Code" }
];

const DEFAULT_PARTICIPANTS = [
    { id: 1, id_bot: 1, nome: "Pedro Henrique", whatsapp: "5511999998888", cargo: "Administrador", mensagens_enviadas: 145, reacoes_recebidas: 32, advertencias: 0, bio: "Desenvolvedor e editor de vídeos nas horas vagas. Criador do Jarvis!", foto_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", aniversario_dia: 15, aniversario_mes: 8, instagram: "pedro_videos" },
    { id: 2, id_bot: 1, nome: "Maria Clara", whatsapp: "5521988887777", cargo: "Membro", mensagens_enviadas: 89, reacoes_recebidas: 12, advertencias: 0, bio: "Apaixonada por estética, design e música 🌸", foto_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", aniversario_dia: 14, aniversario_mes: 6, instagram: "maria_estetica" },
    { id: 3, id_bot: 1, nome: "Lucas Tech", whatsapp: "5531977776666", cargo: "Membro", mensagens_enviadas: 210, reacoes_recebidas: 45, advertencias: 1, bio: "Explorando novas tecnologias e automações 🤖", foto_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150", aniversario_dia: 25, aniversario_mes: 12, instagram: "lucastech" },
    { id: 4, id_bot: 1, nome: "Ana Santos", whatsapp: "5511911112222", cargo: "Membro", mensagens_enviadas: 12, reacoes_recebidas: 2, advertencias: 0, bio: "Entusiasta de marketing digital e SEO.", foto_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150", aniversario_dia: 4, aniversario_mes: 2, instagram: "aninha_mkt" },
    { id: 5, id_bot: 2, nome: "Renata Costa", whatsapp: "5521922223333", cargo: "Administrador", mensagens_enviadas: 54, reacoes_recebidas: 9, advertencias: 0, bio: "Gerente do salão. Foco em suporte técnico.", foto_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", aniversario_dia: 18, aniversario_mes: 6, instagram: "renatinha_costa" }
];

const DEFAULT_ROLES = [
    { id: 1, id_bot: 1, codigo: "ROL-1", descricao: "Churrasco de comemoração JarvisBots!", imagem_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500", data_hora: "2026-06-21T12:00" },
    { id: 2, id_bot: 1, codigo: "ROL-2", descricao: "Reunião de alinhamento técnico do bot", imagem_url: "", data_hora: "2026-06-16T18:00" }
];

const DEFAULT_SCHEDULERS = [
    { id: 1, id_bot: 1, codigo: "AGD-1", tipo_agendamento: "Diário", mensagem: ".nivers hoje", data_hora_execucao: "2026-06-14T09:00" }
];

// Instanciação e persistência
let db_clients = JSON.parse(localStorage.getItem("usuarios_clientes")) || DEFAULT_CLIENTS;
let db_commands = JSON.parse(localStorage.getItem("comandos_bot")) || DEFAULT_COMMANDS;
let db_bots = JSON.parse(localStorage.getItem("instancias_bots")) || DEFAULT_BOTS;
let db_participants = JSON.parse(localStorage.getItem("participantes_grupo")) || DEFAULT_PARTICIPANTS;
let db_roles = JSON.parse(localStorage.getItem("roles_grupo")) || DEFAULT_ROLES;
let db_schedulers = JSON.parse(localStorage.getItem("agendamentos_grupo")) || DEFAULT_SCHEDULERS;

// Migração: Renomeia o bot padrão antigo se ele ainda estiver no localStorage
let defaultBot = db_bots.find(b => b.id_bot === 1 && b.nome_do_bot === "Atendente Comercial");
if (defaultBot) {
    defaultBot.nome_do_bot = "Jarvis";
    defaultBot.prompt_de_personalidade = "Você é o Jarvis, assistente virtual inteligente da plataforma. Seja sempre educado, prestativo e ajude os usuários com seus comandos.";
    localStorage.setItem("instancias_bots", JSON.stringify(db_bots));
}

// Migração: Adiciona comandos de grupo se não existirem no localStorage
let commandMigrated = false;
DEFAULT_COMMANDS.forEach(defaultCmd => {
    if (!db_commands.some(c => c.palavra_gatilho === defaultCmd.palavra_gatilho)) {
        db_commands.push(defaultCmd);
        commandMigrated = true;
    }
});
if (commandMigrated) {
    // Reordenar IDs para manter consistência
    db_commands.forEach((c, index) => {
        c.id = index + 1;
    });
    localStorage.setItem("comandos_bot", JSON.stringify(db_commands));
}

// Estado na memória para mensagens do chat simulado
let chat_messages = {}; // id_bot -> Array de mensagens

// Estado do chat atual
let chatType = "private"; // private ou group
let activeSenderPhone = ""; // Número de WhatsApp do remetente selecionado no grupo
let quotedMessageId = null; // ID da mensagem citada atualmente

// Feed de atividades (sessão)
let activityLog = JSON.parse(sessionStorage.getItem("activity_log")) || [];

// Anti-ban: controle de rate limit
let messageSentTimestamps = [];
const ANTIBAN_MAX_MSGS_PER_MINUTE = 12;
const ANTIBAN_MIN_DELAY_MS = 1200;
const ANTIBAN_MAX_DELAY_MS = 3500;

const saveDB = () => {
    localStorage.setItem("usuarios_clientes", JSON.stringify(db_clients));
    localStorage.setItem("comandos_bot", JSON.stringify(db_commands));
    localStorage.setItem("instancias_bots", JSON.stringify(db_bots));
    localStorage.setItem("participantes_grupo", JSON.stringify(db_participants));
    localStorage.setItem("roles_grupo", JSON.stringify(db_roles));
    localStorage.setItem("agendamentos_grupo", JSON.stringify(db_schedulers));
};

const saveActivity = () => {
    sessionStorage.setItem("activity_log", JSON.stringify(activityLog.slice(-50)));
};

// --------------------------------------------------
// 2. SISTEMA DE TOASTS
// --------------------------------------------------
const showToast = (type, title, message, duration = 4000) => {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.style.position = "relative";
    toast.style.overflow = "hidden";

    const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };

    toast.innerHTML = `
        <div class="toast-icon ${type}">${icons[type] || "ℹ️"}</div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.classList.add('removing'); setTimeout(() => this.parentElement.remove(), 300);">×</button>
        <div class="toast-progress ${type}" style="animation-duration: ${duration}ms;"></div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add("removing");
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
};

// --------------------------------------------------
// 3. CONFIRM MODAL CUSTOMIZADO
// --------------------------------------------------
let confirmResolve = null;

const showConfirm = (title, message, icon = "⚠️") => {
    return new Promise((resolve) => {
        confirmResolve = resolve;
        document.getElementById("confirm-icon").textContent = icon;
        document.getElementById("confirm-title").textContent = title;
        document.getElementById("confirm-message").textContent = message;
        document.getElementById("confirm-modal").classList.add("active");
    });
};

const setupConfirmModal = () => {
    document.getElementById("confirm-cancel").addEventListener("click", () => {
        document.getElementById("confirm-modal").classList.remove("active");
        if (confirmResolve) confirmResolve(false);
        confirmResolve = null;
    });
    document.getElementById("confirm-yes").addEventListener("click", () => {
        document.getElementById("confirm-modal").classList.remove("active");
        if (confirmResolve) confirmResolve(true);
        confirmResolve = null;
    });
    document.getElementById("confirm-modal").addEventListener("click", (e) => {
        if (e.target.id === "confirm-modal") {
            e.target.classList.remove("active");
            if (confirmResolve) confirmResolve(false);
            confirmResolve = null;
        }
    });
};

// --------------------------------------------------
// 4. SISTEMA DE ATIVIDADES
// --------------------------------------------------
const logActivity = (text, type = "system") => {
    activityLog.unshift({
        text,
        type,
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    });
    if (activityLog.length > 50) activityLog = activityLog.slice(0, 50);
    saveActivity();
};

// --------------------------------------------------
// 5. ANTI-BAN: DELAY HUMANIZADO + TYPING INDICATOR
// --------------------------------------------------
const getHumanDelay = () => {
    return ANTIBAN_MIN_DELAY_MS + Math.random() * (ANTIBAN_MAX_DELAY_MS - ANTIBAN_MIN_DELAY_MS);
};

const checkRateLimit = () => {
    const now = Date.now();
    messageSentTimestamps = messageSentTimestamps.filter(t => now - t < 60000);
    if (messageSentTimestamps.length >= ANTIBAN_MAX_MSGS_PER_MINUTE) {
        return false;
    }
    messageSentTimestamps.push(now);
    return true;
};

const showTypingIndicator = (botId) => {
    const box = document.getElementById("chat-messages-box");
    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    indicator.id = "typing-indicator";
    indicator.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
    box.appendChild(indicator);
    box.scrollTop = box.scrollHeight;
};

const removeTypingIndicator = () => {
    const indicator = document.getElementById("typing-indicator");
    if (indicator) indicator.remove();
};

const sendBotResponseWithDelay = (botId, callback) => {
    if (!checkRateLimit()) {
        showToast("warning", "Rate Limit Atingido", "Aguarde um momento antes de enviar mais mensagens. Proteção anti-ban ativa.");
        return;
    }
    showTypingIndicator(botId);
    const delay = getHumanDelay();
    setTimeout(() => {
        removeTypingIndicator();
        callback();
    }, delay);
};

// --------------------------------------------------
// 6. CONTROLES DE NAVEGAÇÃO SPA
// --------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

const initApp = () => {
    setupNavigation();
    setupModals();
    setupConfirmModal();
    setupClientsView();
    setupCommandsView();
    setupBotsView();
    setupChatView();
    setupHamburger();
    setupResetData();
    setupExportButtons();
    updateGlobalStats();
    renderDashboard();
    
    // Ticker para automações (verifica a cada 10 segundos — mais seguro para anti-ban)
    setInterval(runSchedulersCheck, 10000);
};

const setupNavigation = () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const views = document.querySelectorAll(".view-container");
    const pageTitle = document.getElementById("page-title");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetViewId = link.getAttribute("data-view");

            navLinks.forEach(l => l.classList.remove("active"));
            views.forEach(v => v.classList.remove("active"));

            link.classList.add("active");
            document.getElementById(targetViewId).classList.add("active");
            pageTitle.textContent = link.textContent.trim();

            // Recarregar visões dinâmicas ao navegar
            if (targetViewId === "view-dashboard") renderDashboard();
            if (targetViewId === "view-usuarios") renderClients();
            if (targetViewId === "view-comandos") renderCommands();
            if (targetViewId === "view-bots") renderBots();
            if (targetViewId === "view-chat") renderChatSidebar();
            
            updateGlobalStats();

            // Fechar sidebar mobile ao navegar
            document.getElementById("sidebar").classList.remove("mobile-open");
            document.getElementById("sidebar-overlay").classList.remove("active");
        });
    });
};

// --------------------------------------------------
// 7. HAMBURGER MENU (MOBILE)
// --------------------------------------------------
const setupHamburger = () => {
    const btn = document.getElementById("btn-hamburger");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    btn.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
        overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", () => {
        sidebar.classList.remove("mobile-open");
        overlay.classList.remove("active");
    });
};

// --------------------------------------------------
// 8. RESET DE DADOS
// --------------------------------------------------
const setupResetData = () => {
    document.getElementById("btn-reset-data").addEventListener("click", async () => {
        const confirmed = await showConfirm(
            "Resetar Todos os Dados?",
            "Todos os clientes, bots, comandos e dados simulados serão restaurados para os valores padrão. O chat será limpo.",
            "🔄"
        );
        if (confirmed) {
            localStorage.clear();
            sessionStorage.clear();
            chat_messages = {};
            activityLog = [];
            db_clients = [...DEFAULT_CLIENTS];
            db_commands = [...DEFAULT_COMMANDS];
            db_bots = [...DEFAULT_BOTS];
            db_participants = [...DEFAULT_PARTICIPANTS];
            db_roles = [...DEFAULT_ROLES];
            db_schedulers = [...DEFAULT_SCHEDULERS];
            saveDB();

            renderClients();
            renderCommands();
            renderBots();
            renderChatSidebar();
            renderDashboard();
            updateGlobalStats();
            
            // Reset chat state
            selectedBotId = null;
            document.getElementById("chat-placeholder").style.display = "flex";
            document.getElementById("chat-active-screen").style.display = "none";

            showToast("success", "Dados Resetados", "Todos os dados foram restaurados para os valores padrão.");
            logActivity("Dados do sistema resetados para o padrão.", "system");
        }
    });
};

// --------------------------------------------------
// 9. EXPORTAR CSV
// --------------------------------------------------
const setupExportButtons = () => {
    document.getElementById("btn-export-clients").addEventListener("click", () => {
        if (db_clients.length === 0) {
            showToast("warning", "Sem Dados", "Não há clientes para exportar.");
            return;
        }
        const headers = ["ID", "Nome", "WhatsApp", "Status", "Limite Msgs", "Vencimento"];
        const rows = db_clients.map(c => [c.id, c.nome, c.whatsapp, c.status_assinatura, c.limite_mensagens, c.data_vencimento]);
        downloadCSV("clientes_jarvisbots.csv", headers, rows);
        showToast("success", "Exportação Concluída", `${db_clients.length} cliente(s) exportado(s) para CSV.`);
        logActivity(`Exportou ${db_clients.length} clientes para CSV.`, "system");
    });

    document.getElementById("btn-export-commands").addEventListener("click", () => {
        if (db_commands.length === 0) {
            showToast("warning", "Sem Dados", "Não há comandos para exportar.");
            return;
        }
        const headers = ["ID", "Gatilho", "Resposta", "Webhook"];
        const rows = db_commands.map(c => [c.id, c.palavra_gatilho, c.resposta_texto, c.acao_webhook]);
        downloadCSV("comandos_jarvisbots.csv", headers, rows);
        showToast("success", "Exportação Concluída", `${db_commands.length} comando(s) exportado(s) para CSV.`);
        logActivity(`Exportou ${db_commands.length} comandos para CSV.`, "system");
    });
};

const downloadCSV = (filename, headers, rows) => {
    const csvContent = [
        headers.join(";"),
        ...rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(";"))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
};

// --------------------------------------------------
// 10. ESTATÍSTICAS DO DASHBOARD E HEADER
// --------------------------------------------------
const updateGlobalStats = () => {
    const totalClients = db_clients.length;
    const connectedBots = db_bots.filter(b => b.status_conexao === "Conectado").length;
    
    // Total de mensagens limitadas vs usadas (simulação)
    let totalMessagesLimit = db_clients.reduce((acc, c) => acc + parseInt(c.limite_mensagens || 0), 0);
    let totalMessagesUsed = Math.floor(totalMessagesLimit * 0.35); // Simulando 35% de uso

    // Atualiza cabeçalho
    document.getElementById("quick-total-users").textContent = totalClients;
    document.getElementById("quick-total-bots").textContent = connectedBots;
    document.getElementById("quick-total-msgs").textContent = `${totalMessagesUsed.toLocaleString()} / ${totalMessagesLimit.toLocaleString()}`;

    // Atualiza tela de Dashboard (Painel Geral)
    const activeClientsCount = db_clients.filter(c => c.status_assinatura === "Ativo").length;
    const trialClientsCount = db_clients.filter(c => c.status_assinatura === "Trial").length;
    const billingSimulated = (activeClientsCount * 199.90) + (trialClientsCount * 0);

    animateCounter("dash-total-clientes", totalClients);
    animateCounter("dash-total-bots", db_bots.length);
    document.getElementById("dash-faturamento").textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(billingSimulated);
};

const animateCounter = (elementId, targetValue) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const current = parseInt(el.textContent) || 0;
    if (current === targetValue) { el.textContent = targetValue; return; }
    
    const duration = 600;
    const startTime = performance.now();

    const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(current + (targetValue - current) * eased);
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
};

// --------------------------------------------------
// 11. DASHBOARD RICO
// --------------------------------------------------
const renderDashboard = () => {
    renderMessageProgress();
    renderStatusChart();
    renderActivityTimeline();
    renderUpcomingSchedulers();
};

const renderMessageProgress = () => {
    const container = document.getElementById("dash-msg-progress");
    if (!container) return;

    let totalLimit = db_clients.reduce((acc, c) => acc + parseInt(c.limite_mensagens || 0), 0);
    let totalUsed = Math.floor(totalLimit * 0.35);
    let percentage = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0;

    container.innerHTML = `
        <div class="progress-label">
            <span class="progress-label-name">${totalUsed.toLocaleString()} de ${totalLimit.toLocaleString()} mensagens</span>
            <span class="progress-label-value">${percentage}%</span>
        </div>
        <div class="progress-bar-track">
            <div class="progress-bar-fill ${percentage > 80 ? 'danger' : ''}" style="width: 0%;"></div>
        </div>
    `;

    // Animar a barra
    requestAnimationFrame(() => {
        setTimeout(() => {
            container.querySelector(".progress-bar-fill").style.width = percentage + "%";
        }, 100);
    });
};

const renderStatusChart = () => {
    const container = document.getElementById("dash-status-chart");
    if (!container) return;

    const ativo = db_clients.filter(c => c.status_assinatura === "Ativo").length;
    const trial = db_clients.filter(c => c.status_assinatura === "Trial").length;
    const inativo = db_clients.filter(c => c.status_assinatura === "Inativo").length;
    const max = Math.max(ativo, trial, inativo, 1);

    const data = [
        { label: "Ativo", count: ativo, cls: "ativo" },
        { label: "Trial", count: trial, cls: "trial" },
        { label: "Inativo", count: inativo, cls: "inativo" }
    ];

    container.innerHTML = data.map(d => `
        <div class="status-chart-bar-wrap">
            <span class="status-chart-count">${d.count}</span>
            <div class="status-chart-bar ${d.cls}" style="height: 0%;"></div>
            <span class="status-chart-label">${d.label}</span>
        </div>
    `).join("");

    // Animar barras
    requestAnimationFrame(() => {
        setTimeout(() => {
            container.querySelectorAll(".status-chart-bar").forEach((bar, i) => {
                const h = Math.max((data[i].count / max) * 100, 8);
                bar.style.height = h + "%";
            });
        }, 200);
    });
};

const renderActivityTimeline = () => {
    const container = document.getElementById("dash-activity-timeline");
    if (!container) return;

    if (activityLog.length === 0) {
        container.innerHTML = `<div class="activity-empty">Nenhuma atividade registrada nesta sessão.<br><small style="color: var(--text-muted);">Crie clientes, bots ou use o chat para ver atividades aqui.</small></div>`;
        return;
    }

    container.innerHTML = activityLog.slice(0, 15).map(a => `
        <div class="activity-item">
            <div class="activity-dot ${a.type}"></div>
            <div class="activity-info">
                <div class="activity-text">${a.text}</div>
                <div class="activity-time">${a.time}</div>
            </div>
        </div>
    `).join("");
};

const renderUpcomingSchedulers = () => {
    const container = document.getElementById("dash-schedulers");
    if (!container) return;

    const upcoming = db_schedulers
        .filter(s => new Date(s.data_hora_execucao) > new Date())
        .sort((a, b) => new Date(a.data_hora_execucao) - new Date(b.data_hora_execucao))
        .slice(0, 3);

    if (upcoming.length === 0) {
        container.innerHTML = `<div class="scheduler-empty">Nenhum agendamento futuro.<br><small style="color: var(--text-muted);">Use o modal de eventos no chat de grupo para criar agendamentos.</small></div>`;
        return;
    }

    const typeIcons = { "Diário": "🔁", "Semanal": "📆", "Mensal": "📅", "Anual": "🎊", "Único": "⏱️" };

    container.innerHTML = upcoming.map(s => {
        const dt = s.data_hora_execucao.split("T");
        return `
        <div class="scheduler-item">
            <div class="scheduler-icon">${typeIcons[s.tipo_agendamento] || "📅"}</div>
            <div class="scheduler-info">
                <div class="scheduler-msg">#${s.codigo} — "${s.mensagem}"</div>
                <div class="scheduler-meta">${s.tipo_agendamento} • ${formatDate(dt[0])} às ${dt[1]}</div>
            </div>
        </div>`;
    }).join("");
};

// --------------------------------------------------
// 12. SISTEMA DE MODAIS
// --------------------------------------------------
const setupModals = () => {
    const closeButtons = document.querySelectorAll("[data-close]");
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-close");
            document.getElementById(modalId).classList.remove("active");
        });
    });

    // Fechar ao clicar no overlay do modal
    const overlays = document.querySelectorAll(".modal-overlay");
    overlays.forEach(overlay => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.classList.remove("active");
            }
        });
    });
};

const openModal = (id) => {
    document.getElementById(id).classList.add("active");
};

const closeModal = (id) => {
    document.getElementById(id).classList.remove("active");
};

// --------------------------------------------------
// 13. GESTÃO DE USUÁRIOS (CLIENTES) - CRUDS
// --------------------------------------------------
const setupClientsView = () => {
    const btnAdd = document.getElementById("btn-add-client");
    const form = document.getElementById("form-client");
    const searchInput = document.getElementById("search-users");

    btnAdd.addEventListener("click", () => {
        document.getElementById("modal-client-title").textContent = "Adicionar Novo Cliente";
        form.reset();
        document.getElementById("client-id").value = "";
        
        // Define data padrão de vencimento como daqui a 30 dias
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        document.getElementById("client-expiry").value = expiryDate.toISOString().split('T')[0];
        
        openModal("modal-client");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("client-id").value;
        const name = document.getElementById("client-name").value;
        const whatsapp = document.getElementById("client-whatsapp").value.replace(/\D/g, "");
        const status = document.getElementById("client-status").value;
        const limit = parseInt(document.getElementById("client-limit").value);
        const expiry = document.getElementById("client-expiry").value;

        if (id) {
            // EDITAR
            const clientIdx = db_clients.findIndex(c => c.id == id);
            if (clientIdx !== -1) {
                db_clients[clientIdx] = { ...db_clients[clientIdx], nome: name, whatsapp, status_assinatura: status, limite_mensagens: limit, data_vencimento: expiry };
            }
            showToast("success", "Cliente Atualizado", `Os dados de "${name}" foram salvos com sucesso.`);
            logActivity(`Editou o cliente "${name}".`, "edit");
        } else {
            // ADICIONAR
            const newId = db_clients.length > 0 ? Math.max(...db_clients.map(c => c.id)) + 1 : 1;
            db_clients.push({ id: newId, nome: name, whatsapp, status_assinatura: status, limite_mensagens: limit, data_vencimento: expiry });
            showToast("success", "Novo Cliente Cadastrado", `"${name}" foi adicionado à plataforma.`);
            logActivity(`Novo cliente "${name}" cadastrado com status ${status}.`, "create");
        }

        saveDB();
        closeModal("modal-client");
        renderClients();
        updateGlobalStats();
        renderDashboard();
    });

    searchInput.addEventListener("input", () => {
        renderClients(searchInput.value);
    });
};

const renderClients = (filterQuery = "") => {
    const tbody = document.querySelector("#users-table tbody");
    tbody.innerHTML = "";

    const query = filterQuery.toLowerCase().trim();
    const filtered = db_clients.filter(c => 
        c.nome.toLowerCase().includes(query) || 
        c.whatsapp.includes(query)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">Nenhum cliente cadastrado correspondente à busca.</td></tr>`;
        return;
    }

    filtered.forEach(c => {
        const tr = document.createElement("tr");

        let badgeClass = "badge-inativo";
        if (c.status_assinatura === "Ativo") badgeClass = "badge-ativo";
        else if (c.status_assinatura === "Trial") badgeClass = "badge-trial";

        tr.innerHTML = `
            <td>#${c.id}</td>
            <td style="font-weight: 600;">${c.nome}</td>
            <td>${formatWhatsappNumber(c.whatsapp)}</td>
            <td><span class="badge ${badgeClass}">${c.status_assinatura}</span></td>
            <td>${parseInt(c.limite_mensagens).toLocaleString()} msgs</td>
            <td>${formatDate(c.data_vencimento)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-sm" onclick="editClient(${c.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteClient(${c.id})">Excluir</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

const editClient = (id) => {
    const client = db_clients.find(c => c.id == id);
    if (!client) return;

    document.getElementById("modal-client-title").textContent = "Editar Cliente";
    document.getElementById("client-id").value = client.id;
    document.getElementById("client-name").value = client.nome;
    document.getElementById("client-whatsapp").value = client.whatsapp;
    document.getElementById("client-status").value = client.status_assinatura;
    document.getElementById("client-limit").value = client.limite_mensagens;
    document.getElementById("client-expiry").value = client.data_vencimento;

    openModal("modal-client");
};

const deleteClient = async (id) => {
    const client = db_clients.find(c => c.id == id);
    if (!client) return;

    const confirmed = await showConfirm(
        "Excluir Cliente?",
        `"${client.nome}" será removido permanentemente. Todos os bots deste cliente serão deletados automaticamente.`,
        "🗑️"
    );
    if (confirmed) {
        db_clients = db_clients.filter(c => c.id != id);
        // Cascading delete de bots
        db_bots = db_bots.filter(b => b.id_usuario != id);
        saveDB();
        renderClients();
        updateGlobalStats();
        renderDashboard();
        showToast("info", "Cliente Removido", `"${client.nome}" foi excluído da plataforma.`);
        logActivity(`Excluiu o cliente "${client.nome}".`, "delete");
    }
};

// --------------------------------------------------
// 14. GESTÃO DE COMANDOS (BOT) - CRUDS
// --------------------------------------------------
const setupCommandsView = () => {
    const btnAdd = document.getElementById("btn-add-command");
    const form = document.getElementById("form-command");
    const searchInput = document.getElementById("search-commands");

    btnAdd.addEventListener("click", () => {
        document.getElementById("modal-command-title").textContent = "Criar Comando do Bot";
        form.reset();
        document.getElementById("command-id").value = "";
        openModal("modal-command");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("command-id").value;
        let trigger = document.getElementById("command-trigger").value.trim();
        const response = document.getElementById("command-response").value;
        const webhook = document.getElementById("command-webhook").value.trim();

        // Força o gatilho a começar com / ou . caso não tenha
        if (!trigger.startsWith("/") && !trigger.startsWith(".") && trigger.length > 0) {
            trigger = "/" + trigger;
        }

        if (id) {
            // EDITAR
            const cmdIdx = db_commands.findIndex(c => c.id == id);
            if (cmdIdx !== -1) {
                db_commands[cmdIdx] = { ...db_commands[cmdIdx], palavra_gatilho: trigger, resposta_texto: response, acao_webhook: webhook };
            }
            showToast("success", "Comando Atualizado", `O gatilho "${trigger}" foi salvo com sucesso.`);
            logActivity(`Editou o comando "${trigger}".`, "edit");
        } else {
            // ADICIONAR
            // Valida duplicidade de gatilho
            if (db_commands.some(c => c.palavra_gatilho.toLowerCase() === trigger.toLowerCase())) {
                showToast("error", "Gatilho Duplicado", "Esta palavra-gatilho já está registrada! Use outra.");
                return;
            }
            const newId = db_commands.length > 0 ? Math.max(...db_commands.map(c => c.id)) + 1 : 1;
            db_commands.push({ id: newId, palavra_gatilho: trigger, resposta_texto: response, acao_webhook: webhook });
            showToast("success", "Comando Criado", `O gatilho "${trigger}" está ativo nos bots.`);
            logActivity(`Novo comando "${trigger}" criado.`, "create");
        }

        saveDB();
        closeModal("modal-command");
        renderCommands();
    });

    searchInput.addEventListener("input", () => {
        renderCommands(searchInput.value);
    });
};

const renderCommands = (filterQuery = "") => {
    const tbody = document.querySelector("#commands-table tbody");
    tbody.innerHTML = "";

    const query = filterQuery.toLowerCase().trim();
    const filtered = db_commands.filter(c => 
        c.palavra_gatilho.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">Nenhum comando cadastrado correspondente à busca.</td></tr>`;
        return;
    }

    filtered.forEach(c => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>#${c.id}</td>
            <td><code style="color: var(--accent-secondary); font-weight:700; background:rgba(6,182,212,0.1); padding: 4px 8px; border-radius: 6px;">${c.palavra_gatilho}</code></td>
            <td style="max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.resposta_texto || '<em style="color:var(--text-muted)">Sem resposta de texto</em>'}</td>
            <td style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${c.acao_webhook ? `<a href="${c.acao_webhook}" target="_blank" style="color: var(--accent-primary-hover); text-decoration:none; font-size:12px;">${c.acao_webhook}</a>` : '<span style="color:var(--text-muted)">-</span>'}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-sm" onclick="editCommand(${c.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCommand(${c.id})">Excluir</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

const editCommand = (id) => {
    const cmd = db_commands.find(c => c.id == id);
    if (!cmd) return;

    document.getElementById("modal-command-title").textContent = "Editar Comando";
    document.getElementById("command-id").value = cmd.id;
    document.getElementById("command-trigger").value = cmd.palavra_gatilho;
    document.getElementById("command-response").value = cmd.resposta_texto;
    document.getElementById("command-webhook").value = cmd.acao_webhook;

    openModal("modal-command");
};

const deleteCommand = async (id) => {
    const cmd = db_commands.find(c => c.id == id);
    if (!cmd) return;

    const confirmed = await showConfirm(
        "Excluir Comando?",
        `O gatilho "${cmd.palavra_gatilho}" será removido. Os bots não responderão mais a essa palavra-chave.`,
        "🗑️"
    );
    if (confirmed) {
        db_commands = db_commands.filter(c => c.id != id);
        saveDB();
        renderCommands();
        showToast("info", "Comando Excluído", `O gatilho "${cmd.palavra_gatilho}" foi removido.`);
        logActivity(`Excluiu o comando "${cmd.palavra_gatilho}".`, "delete");
    }
};

// --------------------------------------------------
// 15. FÁBRICA DE BOTS (GERADOR E CARDS)
// --------------------------------------------------
const setupBotsView = () => {
    const btnGenerate = document.getElementById("btn-generate-bot");
    const form = document.getElementById("form-bot");

    btnGenerate.addEventListener("click", () => {
        // Popula o select de clientes ativos ou trial
        const selectClient = document.getElementById("bot-client");
        selectClient.innerHTML = "";

        const viableClients = db_clients.filter(c => c.status_assinatura === "Ativo" || c.status_assinatura === "Trial");
        if (viableClients.length === 0) {
            showToast("warning", "Sem Clientes Disponíveis", "Cadastre pelo menos um cliente com plano Ativo ou Trial antes de gerar um Bot!");
            return;
        }

        viableClients.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = `${c.nome} (${formatWhatsappNumber(c.whatsapp)})`;
            selectClient.appendChild(opt);
        });

        form.reset();
        openModal("modal-bot");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("bot-name").value;
        const clientId = parseInt(document.getElementById("bot-client").value);
        const prompt = document.getElementById("bot-prompt").value;

        const newId = db_bots.length > 0 ? Math.max(...db_bots.map(b => b.id_bot)) + 1 : 1;
        
        db_bots.push({
            id_bot: newId,
            id_usuario: clientId,
            nome_do_bot: name,
            prompt_de_personalidade: prompt,
            status_conexao: "Aguardando QR Code"
        });

        saveDB();
        closeModal("modal-bot");
        renderBots();
        updateGlobalStats();
        renderDashboard();
        showToast("success", "Bot Criado", `O bot "${name}" foi criado! Conecte-o via QR Code.`);
        logActivity(`Novo bot "${name}" criado na fábrica.`, "create");
    });
};

const renderBots = () => {
    const container = document.getElementById("bots-container");
    container.innerHTML = "";

    if (db_bots.length === 0) {
        container.innerHTML = `<div class="card-glass" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">Nenhum robô gerado. Clique no botão acima para criar o seu primeiro Bot!</div>`;
        return;
    }

    db_bots.forEach(b => {
        const owner = db_clients.find(c => c.id === b.id_usuario);
        const ownerName = owner ? owner.nome : "Cliente Desconhecido";
        
        const card = document.createElement("div");
        card.className = "card-glass bot-card";

        let badgeClass = "desconectado";
        let badgeText = "Desconectado";
        let connectionButtonText = "Conectar Bot";
        let connectionButtonClass = "btn-primary";

        if (b.status_conexao === "Conectado") {
            badgeClass = "conectado";
            badgeText = "Conectado";
            connectionButtonText = "Desconectar";
            connectionButtonClass = "btn-secondary";
        } else if (b.status_conexao === "Aguardando QR Code") {
            badgeClass = "aguardando";
            badgeText = "Aguardando QR Code";
            connectionButtonText = "Escanear QR Code";
            connectionButtonClass = "btn-primary";
        }

        card.innerHTML = `
            <div>
                <div class="bot-card-top">
                    <div class="bot-avatar-wrapper">
                        <div class="bot-icon">${b.nome_do_bot.substring(0, 2).toUpperCase()}</div>
                        <div class="bot-details">
                            <h4>${b.nome_do_bot}</h4>
                            <span>Dono: <strong>${ownerName}</strong></span>
                        </div>
                    </div>
                    <span class="badge badge-conexao ${badgeClass}">${badgeText}</span>
                </div>
                
                <div class="bot-prompt-preview">
                    <strong>Diretriz (Prompt):</strong><br>
                    ${b.prompt_de_personalidade}
                </div>
            </div>
            
            <div class="bot-card-footer">
                <button class="btn ${connectionButtonClass} btn-sm" onclick="handleBotConnection(${b.id_bot})">${connectionButtonText}</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBot(${b.id_bot})">Excluir</button>
            </div>
        `;
        container.appendChild(card);
    });
};

const handleBotConnection = (id_bot) => {
    const bot = db_bots.find(b => b.id_bot === id_bot);
    if (!bot) return;

    if (bot.status_conexao === "Conectado") {
        // Desconecta
        showConfirm(
            "Desconectar Bot?",
            `A instância de WhatsApp do bot "${bot.nome_do_bot}" será desconectada. Ele não responderá mais mensagens.`,
            "🔌"
        ).then(confirmed => {
            if (confirmed) {
                bot.status_conexao = "Desconectado";
                saveDB();
                renderBots();
                updateGlobalStats();
                showToast("info", "Bot Desconectado", `"${bot.nome_do_bot}" está offline.`);
                logActivity(`Bot "${bot.nome_do_bot}" desconectado.`, "edit");
            }
        });
    } else {
        // Abre simulador de leitura de QR Code
        bot.status_conexao = "Aguardando QR Code";
        saveDB();
        renderBots();
        
        document.getElementById("qrcode-bot-name").textContent = bot.nome_do_bot;
        const statusText = document.getElementById("qrcode-status-text");
        statusText.className = "qrcode-status-message loading";
        statusText.textContent = "Aguardando leitura do QR Code pelo celular...";
        
        openModal("modal-qrcode");

        // Simula conexão após 3 segundos
        setTimeout(() => {
            if (document.getElementById("modal-qrcode").classList.contains("active")) {
                statusText.className = "qrcode-status-message loading";
                statusText.textContent = "QR Code lido! Estabelecendo conexão com o WhatsApp...";
            }
        }, 2500);

        setTimeout(() => {
            if (document.getElementById("modal-qrcode").classList.contains("active")) {
                bot.status_conexao = "Conectado";
                saveDB();
                renderBots();
                updateGlobalStats();
                
                statusText.className = "qrcode-status-message success";
                statusText.innerHTML = `🟢 Instância conectada com sucesso!`;
                
                showToast("success", "Bot Conectado!", `"${bot.nome_do_bot}" está online e pronto para receber mensagens.`);
                logActivity(`Bot "${bot.nome_do_bot}" conectado via QR Code.`, "create");
                
                // Fecha o modal em 1.5s
                setTimeout(() => {
                    closeModal("modal-qrcode");
                }, 1500);
            }
        }, 5000);
    }
};

const deleteBot = async (id_bot) => {
    const bot = db_bots.find(b => b.id_bot === id_bot);
    if (!bot) return;

    const confirmed = await showConfirm(
        "Excluir Bot?",
        `O robô "${bot.nome_do_bot}" será excluído permanentemente. Todos os dados de participantes e rolês associados serão perdidos.`,
        "🗑️"
    );
    if (confirmed) {
        db_bots = db_bots.filter(b => b.id_bot != id_bot);
        db_participants = db_participants.filter(p => p.id_bot != id_bot);
        db_roles = db_roles.filter(r => r.id_bot != id_bot);
        db_schedulers = db_schedulers.filter(s => s.id_bot != id_bot);
        delete chat_messages[id_bot];
        saveDB();
        renderBots();
        updateGlobalStats();
        renderDashboard();
        showToast("info", "Bot Excluído", `"${bot.nome_do_bot}" foi removido da fábrica.`);
        logActivity(`Excluiu o bot "${bot.nome_do_bot}".`, "delete");
    }
};

// --------------------------------------------------
// 16. CHAT DE TESTE (SIMULADOR DE WHATSAPP)
// --------------------------------------------------
let selectedBotId = null;

const setupChatView = () => {
    const form = document.getElementById("chat-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("chat-message-input");
        const msgText = input.value.trim();
        if (!msgText || !selectedBotId) return;

        sendMessageFromAdmin(msgText);
        input.value = "";
    });

    const typeSelect = document.getElementById("chat-type-select");
    const senderSelect = document.getElementById("chat-sender-select");
    const senderWrapper = document.getElementById("chat-sender-wrapper");
    const eventBtn = document.getElementById("btn-open-event-modal");

    typeSelect.addEventListener("change", (e) => {
        chatType = e.target.value;
        if (chatType === "group") {
            senderWrapper.style.display = "flex";
            eventBtn.style.display = "flex";
            populateSendersDropdown();
        } else {
            senderWrapper.style.display = "none";
            eventBtn.style.display = "none";
            cancelReply();
        }
        renderMessages();
    });

    senderSelect.addEventListener("change", (e) => {
        activeSenderPhone = e.target.value;
    });

    // Abrir modal de eventos
    eventBtn.addEventListener("click", () => {
        const datetimeInput = document.getElementById("event-datetime");
        const now = new Date();
        now.setMinutes(now.getMinutes() + 1);
        const tzoffset = now.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(now - tzoffset)).toISOString().slice(0, 16);
        datetimeInput.value = localISOTime;
        datetimeInput.min = localISOTime;
        
        openModal("modal-event-whatsapp");
    });

    // Submeter formulário do modal de evento
    const formEvent = document.getElementById("form-event-whatsapp");
    formEvent.addEventListener("submit", (e) => {
        e.preventDefault();
        const botId = selectedBotId;
        if (!botId) return;

        const titleSelect = document.getElementById("event-title");
        const frequency = titleSelect.options[titleSelect.selectedIndex].text.split("(")[1].replace(")", ""); // 'Diário', 'Semanal', etc.
        const commandText = document.getElementById("event-description").value.trim();
        const datetime = document.getElementById("event-datetime").value;
        
        const newCode = "AGD-" + (db_schedulers.length > 0 ? Math.max(...db_schedulers.map(s => parseInt(s.codigo.split("-")[1]) || 0)) + 1 : 1);
        
        const newScheduler = {
            id: db_schedulers.length > 0 ? Math.max(...db_schedulers.map(s => s.id)) + 1 : 1,
            id_bot: botId,
            codigo: newCode,
            tipo_agendamento: frequency === "Execução Única" ? "Único" : frequency,
            mensagem: commandText,
            data_hora_execucao: datetime
        };
        
        db_schedulers.push(newScheduler);
        saveDB();
        closeModal("modal-event-whatsapp");
        formEvent.reset();
        
        // Anuncia a criação no grupo
        chat_messages[botId].push({
            sender: "system",
            text: `📅 [Evento WhatsApp Criado] Agendamento #${newCode} cadastrado com sucesso! Frequência: ${newScheduler.tipo_agendamento}. Próxima execução: ${formatDate(datetime.split("T")[0])} às ${datetime.split("T")[1]}.`
        });
        renderMessages();
        renderDashboard();
        showToast("success", "Agendamento Criado", `#${newCode} (${newScheduler.tipo_agendamento}) agendado.`);
        logActivity(`Agendamento #${newCode} criado: "${commandText}".`, "create");
    });

    // Cancelar citação
    document.getElementById("btn-cancel-reply").addEventListener("click", () => {
        cancelReply();
    });
};

const populateSendersDropdown = () => {
    const select = document.getElementById("chat-sender-select");
    select.innerHTML = "";
    const currentParticipants = db_participants.filter(p => p.id_bot === selectedBotId);
    currentParticipants.forEach(p => {
        const option = document.createElement("option");
        option.value = p.whatsapp;
        option.textContent = `${p.nome} (${p.cargo})`;
        select.appendChild(option);
    });
    if (currentParticipants.length > 0) {
        activeSenderPhone = currentParticipants[0].whatsapp;
        select.value = activeSenderPhone;
    }
};

const renderChatSidebar = () => {
    const listContainer = document.getElementById("chat-bot-list");
    listContainer.innerHTML = "";

    if (db_bots.length === 0) {
        listContainer.innerHTML = `<div style="padding: 20px; text-align:center; color: var(--text-muted); font-size:12px;">Crie um Bot primeiro na Fábrica.</div>`;
        return;
    }

    db_bots.forEach(b => {
        const li = document.createElement("li");
        li.className = `chat-bot-item ${selectedBotId === b.id_bot ? 'active' : ''}`;
        
        const isOnline = b.status_conexao === "Conectado";
        
        li.innerHTML = `
            <div class="chat-bot-item-icon">${b.nome_do_bot.substring(0, 2).toUpperCase()}</div>
            <div class="chat-bot-item-details">
                <div class="chat-bot-item-name">${b.nome_do_bot}</div>
                <div class="chat-bot-item-status ${isOnline ? '' : 'offline'}">
                    ${isOnline ? 'Conectado' : 'Offline'}
                </div>
            </div>
        `;

        li.addEventListener("click", () => {
            if (isOnline) {
                selectBotForChat(b.id_bot);
            } else {
                showToast("warning", "Bot Offline", "Conecte este bot na Fábrica de Bots antes de testá-lo!");
            }
        });

        listContainer.appendChild(li);
    });
};

const selectBotForChat = (id_bot) => {
    selectedBotId = id_bot;
    
    renderChatSidebar();

    const bot = db_bots.find(b => b.id_bot === id_bot);
    if (!bot) return;

    document.getElementById("chat-placeholder").style.display = "none";
    document.getElementById("chat-active-screen").style.display = "flex";

    document.getElementById("chat-header-avatar").textContent = bot.nome_do_bot.substring(0, 2).toUpperCase();
    document.getElementById("chat-header-name").textContent = bot.nome_do_bot;
    
    // Reset group controls
    chatType = "private";
    document.getElementById("chat-type-select").value = "private";
    document.getElementById("chat-sender-wrapper").style.display = "none";
    document.getElementById("btn-open-event-modal").style.display = "none";
    cancelReply();

    if (!chat_messages[id_bot]) {
        chat_messages[id_bot] = [
            { sender: "system", text: "Início da simulação de chat. Os comandos e o prompt de personalidade abaixo serão usados para processar as respostas." },
            { sender: "system", text: `🧠 Prompt Ativo: "${bot.prompt_de_personalidade}"` },
            { sender: "system", text: `🛡️ Anti-Ban: Delay humanizado ativo (${(ANTIBAN_MIN_DELAY_MS/1000).toFixed(1)}s-${(ANTIBAN_MAX_DELAY_MS/1000).toFixed(1)}s). Limite: ${ANTIBAN_MAX_MSGS_PER_MINUTE} msgs/min.` },
            { sender: "received", text: `Olá! Sou o ${bot.nome_do_bot}, seu robô conectado. Digite qualquer comando configurado ou fale comigo para simular a resposta de IA.`, time: getCurrentTime() }
        ];
    }

    renderMessages();
};

const renderMessages = () => {
    const box = document.getElementById("chat-messages-box");
    box.innerHTML = "";

    if (!selectedBotId || !chat_messages[selectedBotId]) return;

    chat_messages[selectedBotId].forEach(msg => {
        if (msg.sender === "system") {
            const div = document.createElement("div");
            div.className = "chat-system-info";
            div.textContent = msg.text;
            box.appendChild(div);
        } else if (msg.sender === "private-warning") {
            const div = document.createElement("div");
            div.className = "chat-bubble private-warning";
            div.innerHTML = msg.text.replace(/\n/g, "<br>");
            box.appendChild(div);
        } else if (msg.sender === "event-card") {
            // Rich Event Card
            const div = document.createElement("div");
            div.className = "chat-bubble event-card-bubble";
            if (msg.messageId) div.setAttribute("data-msg-id", msg.messageId);
            
            let imageHtml = "";
            if (msg.eventData && msg.eventData.imagem_url) {
                imageHtml = `<img class="event-card-image" src="${msg.eventData.imagem_url}" alt="Imagem do Rolê" onerror="this.style.display='none'">`;
            }

            div.innerHTML = `
                <div class="event-card">
                    <div class="event-card-header">
                        <div class="event-card-icon">📅</div>
                        <div>
                            <div class="event-card-title">${msg.eventData.descricao}</div>
                            <div style="font-size: 11px; color: var(--text-muted);">#${msg.eventData.codigo}</div>
                        </div>
                    </div>
                    ${imageHtml}
                    <div class="event-card-info">
                        <strong>Quando:</strong> ${msg.eventData.data_formatada}<br>
                        <small style="color: var(--text-muted);">Para alterar use <code>.role.alterar</code> | Para excluir use <code>.role.excluir</code></small>
                    </div>
                    <div class="event-card-footer">
                        <span>Criado pelo Bot</span>
                        <span>${msg.time}</span>
                    </div>
                </div>
            `;
            box.appendChild(div);
        } else {
            const div = document.createElement("div");
            
            if (chatType === "private") {
                div.className = `chat-bubble ${msg.sender === 'sent' ? 'sent' : 'received'}`;
                div.innerHTML = `
                    ${msg.text.replace(/\n/g, "<br>")}
                    <span class="chat-bubble-time">${msg.time}</span>
                `;
            } else {
                const isSentByMe = msg.senderPhone === activeSenderPhone;
                div.className = `chat-bubble ${isSentByMe ? 'sent' : 'received'}`;
                
                if (msg.messageId) {
                    div.setAttribute("data-msg-id", msg.messageId);
                }

                let colorClass = "sender-color-1";
                if (msg.senderPhone === "bot") {
                    colorClass = "sender-color-bot";
                } else {
                    const idx = db_participants.findIndex(p => p.whatsapp === msg.senderPhone);
                    if (idx !== -1) {
                        colorClass = `sender-color-${(idx % 5) + 1}`;
                    }
                }

                let replyHtml = "";
                if (msg.quotedMsg) {
                    replyHtml = `
                        <div class="chat-bubble-reply-preview">
                            <strong>${msg.quotedMsg.author}</strong>: ${msg.quotedMsg.text}
                        </div>
                    `;
                }

                let reactionsHtml = "";
                if (msg.reactions && Object.keys(msg.reactions).length > 0) {
                    reactionsHtml = `
                        <div class="chat-bubble-reactions" onclick="handleReactionClick('${msg.senderPhone}')">
                            ${Object.entries(msg.reactions).map(([emoji, count]) => `${emoji} ${count}`).join(' ')}
                        </div>
                    `;
                }

                let actionsHtml = "";
                if (msg.senderPhone !== "bot") {
                    actionsHtml = `
                        <div class="chat-bubble-actions">
                            <button type="button" class="chat-action-btn" title="Citar Mensagem" onclick="quoteMessage('${msg.messageId}')">💬</button>
                            <button type="button" class="chat-action-btn" title="Ver Bio" onclick="reactWithQuestionMark('${msg.messageId}')">❓</button>
                        </div>
                    `;
                }

                div.innerHTML = `
                    <span class="chat-bubble-sender-name ${colorClass}" onclick="openParticipantBio('${msg.senderPhone}')">${msg.senderName}</span>
                    ${replyHtml}
                    ${msg.text.replace(/\n/g, "<br>")}
                    <span class="chat-bubble-time">${msg.time}</span>
                    ${reactionsHtml}
                    ${actionsHtml}
                `;
            }
            box.appendChild(div);
        }
    });

    box.scrollTop = box.scrollHeight;
};

const sendMessageFromAdmin = (text) => {
    const botId = selectedBotId;
    if (!botId) return;

    const bot = db_bots.find(b => b.id_bot === botId);
    if (!bot) return;

    if (chatType === "private") {
        chat_messages[botId].push({
            sender: "sent",
            text: text,
            time: getCurrentTime()
        });
        renderMessages();
        
        sendBotResponseWithDelay(botId, () => {
            processBotResponse(botId, text);
        });
    } else {
        const activeParticipant = db_participants.find(p => p.id_bot === botId && p.whatsapp === activeSenderPhone);
        const msgId = "msg-" + Date.now();
        
        const newMsg = {
            messageId: msgId,
            sender: "sent",
            senderName: activeParticipant ? activeParticipant.nome : "Administrador",
            senderPhone: activeParticipant ? activeParticipant.whatsapp : "5511999998888",
            senderRole: activeParticipant ? activeParticipant.cargo : "Administrador",
            text: text,
            time: getCurrentTime()
        };
        
        if (quotedMessageId) {
            const quotedMsg = chat_messages[botId].find(m => m.messageId === quotedMessageId);
            if (quotedMsg) {
                newMsg.quotedMsg = {
                    author: quotedMsg.senderName || (quotedMsg.sender === "received" ? "Bot" : "Você"),
                    text: quotedMsg.text,
                    codigo: quotedMsg.codigo || null
                };
            }
            cancelReply();
        }
        
        chat_messages[botId].push(newMsg);
        
        if (activeParticipant) {
            activeParticipant.mensagens_enviadas++;
            saveDB();
        }
        
        renderMessages();
        
        if (text.startsWith(".")) {
            sendBotResponseWithDelay(botId, () => {
                processGroupCommand(botId, text, activeSenderPhone);
            });
        } else {
            const query = text.toLowerCase().trim();
            const prompt = bot.prompt_de_personalidade;
            
            if (query.includes("plano") || query.includes("preço") || query.includes("valor") ||
                query.includes("venda") || query.includes("comprar") || query.includes("desconto")) {
                sendBotResponseWithDelay(botId, () => {
                    let botResponse = "";
                    if (query.includes("plano") || query.includes("preço") || query.includes("valor")) {
                        botResponse = `🤖 Vi que perguntou sobre preços/planos, @${activeParticipant ? activeParticipant.nome : 'Membro'}.\n\nNossos planos começam a partir de R$ 199,90/mês. Digite /ajuda para mais opções.`;
                    } else {
                        botResponse = `🤖 Oi @${activeParticipant ? activeParticipant.nome : 'Membro'}! Posso te oferecer até 10% de desconto para fechamentos via PIX hoje.`;
                    }
                    chat_messages[botId].push({
                        sender: "received",
                        senderName: bot.nome_do_bot,
                        senderPhone: "bot",
                        text: botResponse,
                        time: getCurrentTime()
                    });
                    renderMessages();
                });
            }
        }
    }
};

const processBotResponse = (botId, userText) => {
    const bot = db_bots.find(b => b.id_bot === botId);
    if (!bot) return;

    const query = userText.toLowerCase().trim();
    const matchedCommand = db_commands.find(c => c.palavra_gatilho.toLowerCase() === query);

    if (matchedCommand) {
        // Adicionar pequena variação humana ao texto do comando
        const variations = ["", " 😊", " 👍", ""];
        const suffix = variations[Math.floor(Math.random() * variations.length)];

        chat_messages[botId].push({
            sender: "received",
            text: (matchedCommand.resposta_texto || "Disparo efetuado com sucesso.") + suffix,
            time: getCurrentTime()
        });

        if (matchedCommand.acao_webhook) {
            chat_messages[botId].push({
                sender: "system",
                text: `🔗 [Ação externa Webhook] Requisição POST simulada para: ${matchedCommand.acao_webhook}`
            });
        }
        logActivity(`Comando "${matchedCommand.palavra_gatilho}" acionado no chat.`, "command");
    } else {
        const prompt = bot.prompt_de_personalidade;
        let botResponse = `🤖 Recebi sua mensagem: "${userText}".\n\nEstou atuando sob as seguintes diretrizes de personalidade:\n👉 "${prompt}"\n\nDigite um comando configurado (ex: /ajuda) para ver as opções.`;
        
        if (query.includes("plano") || query.includes("preço") || query.includes("valor")) {
            botResponse = `🤖 Percebi que você perguntou sobre planos/preços.\n\nCom base nas minhas regras ("${prompt}"), nossos planos começam a partir de R$ 199,90/mês. Gostaria de receber o link?`;
        } else if (query.includes("venda") || query.includes("comprar") || query.includes("desconto")) {
            botResponse = `🤖 Entendi seu interesse!\n\nDe acordo com minhas instruções ("${prompt}"), posso oferecer até 10% de desconto para fechamentos via PIX hoje. Vamos prosseguir?`;
        }

        chat_messages[botId].push({
            sender: "received",
            text: botResponse,
            time: getCurrentTime()
        });
    }

    renderMessages();
};

const processGroupCommand = (botId, text, senderPhone, isAutoExec = false) => {
    const bot = db_bots.find(b => b.id_bot === botId);
    if (!bot) return;

    const parts = text.split(" ");
    const cmd = parts[0].toLowerCase().trim();
    const args = parts.slice(1).join(" ").trim();

    const participant = db_participants.find(p => p.id_bot === botId && p.whatsapp === senderPhone);
    if (!participant) return;

    let responseText = "";
    let isPrivate = false;

    if (cmd === ".meusdados" || cmd === ".dados") {
        const zodiac = getZodiacSign(participant.aniversario_dia, participant.aniversario_mes) || "Não configurado";
        const niverStr = participant.aniversario_dia ? `${String(participant.aniversario_dia).padStart(2, '0')}/${String(participant.aniversario_mes).padStart(2, '0')}` : "Não configurado";
        responseText = `📊 *Estatísticas de @${participant.nome} no Grupo:*
- *Cargo:* ${participant.cargo}
- *Mensagens Enviadas:* ${participant.mensagens_enviadas}
- *Reações Recebidas:* ${participant.reacoes_recebidas}
- *Advertências:* ${participant.advertencias}
- *Instagram:* ${participant.instagram ? '@' + participant.instagram : 'Não configurado'}
- *Aniversário:* ${niverStr}
- *Signo:* ${zodiac}`;
    }
    else if (cmd === ".bio") {
        if (!args) {
            responseText = `🧠 *Perfil de @${participant.nome}:*\n"${participant.bio || 'Sem bio cadastrada.'}"\n\nConfigure com: \n- \`.bio <sua biografia>\`\n- \`.bio foto <URL da imagem>\``;
        } else if (args.toLowerCase().startsWith("foto ")) {
            const url = args.substring(5).trim();
            participant.foto_url = url;
            saveDB();
            responseText = `✅ *Foto de perfil atualizada com sucesso!*`;
        } else {
            participant.bio = args;
            saveDB();
            responseText = `✅ *Biografia atualizada com sucesso!*`;
        }
    }
    else if (cmd === ".niver") {
        if (!args) {
            responseText = `🎂 *Como configurar aniversário:* \`.niver DD/MM\` (Ex: \`.niver 14/06\`)`;
        } else {
            const dateParts = args.split("/");
            const day = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]);
            if (dateParts.length === 2 && !isNaN(day) && !isNaN(month) && day >= 1 && day <= 31 && month >= 1 && month <= 12) {
                participant.aniversario_dia = day;
                participant.aniversario_mes = month;
                saveDB();
                responseText = `🎂 *Aniversário configurado com sucesso para:* ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')} (${getZodiacSign(day, month)})!`;
            } else {
                responseText = `⚠️ *Formato inválido!* Use DD/MM (Ex: \`.niver 15/08\`).`;
            }
        }
    }
    else if (cmd === ".niver.excluir") {
        participant.aniversario_dia = null;
        participant.aniversario_mes = null;
        saveDB();
        responseText = `❌ *Seu aniversário foi excluído da lista.*`;
    }
    else if (cmd === ".nivers") {
        isPrivate = participant.cargo !== "Administrador" && !isAutoExec;
        const currentMonth = new Date().getMonth() + 1;
        const currentDay = new Date().getDate();

        let filtered = [];
        let title = "";

        if (args === "hoje") {
            filtered = db_participants.filter(p => p.id_bot === botId && p.aniversario_dia === currentDay && p.aniversario_mes === currentMonth);
            title = "🎂 *Aniversariantes de Hoje:*";
        } else if (args === "ano") {
            filtered = db_participants.filter(p => p.id_bot === botId && p.aniversario_dia !== null);
            title = "🗓️ *Aniversariantes do Ano:*";
            filtered.sort((a, b) => a.aniversario_mes - b.aniversario_mes || a.aniversario_dia - b.aniversario_dia);
        } else {
            filtered = db_participants.filter(p => p.id_bot === botId && p.aniversario_mes === currentMonth);
            title = `📅 *Aniversariantes do Mês (Mês ${currentMonth}):*`;
            filtered.sort((a, b) => a.aniversario_dia - b.aniversario_dia);
        }

        if (filtered.length === 0) {
            responseText = `${title}\nNenhum participante com aniversário configurado neste período.`;
        } else {
            responseText = `${title}\n` + filtered.map(p => `- *${p.nome}* (${String(p.aniversario_dia).padStart(2, '0')}/${String(p.aniversario_mes).padStart(2, '0')})`).join("\n");
        }
    }
    else if (cmd === ".signos") {
        isPrivate = participant.cargo !== "Administrador" && !isAutoExec;
        const activeParticipants = db_participants.filter(p => p.id_bot === botId && p.aniversario_dia !== null);
        
        if (activeParticipants.length === 0) {
            responseText = `🔮 *Relação de Signos do Zodíaco:* \nNenhum participante cadastrou aniversário até o momento.`;
        } else {
            const grouped = {};
            activeParticipants.forEach(p => {
                const s = getZodiacSign(p.aniversario_dia, p.aniversario_mes);
                if (!grouped[s]) grouped[s] = [];
                grouped[s].push(p.nome);
            });
            
            responseText = `🔮 *Signos dos Integrantes do Grupo:*\n\n` + 
                Object.entries(grouped).map(([signo, nomes]) => `*${signo}:*\n` + nomes.map(n => `  - ${n}`).join("\n")).join("\n\n");
        }
    }
    else if (cmd === ".ig") {
        if (!args) {
            const list = db_participants.filter(p => p.id_bot === botId && p.instagram);
            if (list.length === 0) {
                responseText = `📸 *Instagrams do Grupo:*\nNenhum usuário cadastrou Instagram ainda.`;
            } else {
                responseText = `📸 *Instagrams Cadastrados no Grupo:*\n` + 
                    list.map(p => `- *${p.nome}*: @${p.instagram}`).join("\n");
            }
        } else {
            const handle = args.replace("@", "").trim();
            participant.instagram = handle;
            saveDB();
            responseText = `📸 *Instagram configurado com sucesso:* @${handle}`;
        }
    }
    else if (cmd === ".ig.excluir") {
        participant.instagram = null;
        saveDB();
        responseText = `❌ *Seu Instagram foi removido da lista.*`;
    }
    else if (cmd === ".role.criar") {
        if (!args) {
            responseText = `⚠️ *Uso correto:* \`.role.criar <descrição> [data: DD/MM/AAAA HH:MM] [imagem: URL]\``;
        } else {
            let desc = args;
            let dateStr = "";
            let imgUrl = "";
            
            if (desc.includes("data:")) {
                const partsDate = desc.split("data:");
                desc = partsDate[0].trim();
                const rest = partsDate[1].trim();
                
                if (rest.includes("imagem:")) {
                    const partsImg = rest.split("imagem:");
                    dateStr = partsImg[0].trim();
                    imgUrl = partsImg[1].trim();
                } else {
                    dateStr = rest;
                }
            } else if (desc.includes("imagem:")) {
                const partsImg = desc.split("imagem:");
                desc = partsImg[0].trim();
                imgUrl = partsImg[1].trim();
            }

            const newCode = "ROL-" + (db_roles.length > 0 ? Math.max(...db_roles.map(r => parseInt(r.codigo.split("-")[1]) || 0)) + 1 : 1);
            const newRole = {
                id: db_roles.length > 0 ? Math.max(...db_roles.map(r => r.id)) + 1 : 1,
                id_bot: botId,
                codigo: newCode,
                descricao: desc,
                imagem_url: imgUrl,
                data_hora: dateStr || new Date(Date.now() + 24*60*60*1000).toISOString().substring(0, 16)
            };
            db_roles.push(newRole);
            saveDB();

            sendGroupEventCard(botId, newRole);
            logActivity(`Rolê #${newCode} criado: "${desc}".`, "create");
            return;
        }
    }
    else if (cmd === ".role.alterar") {
        let code = "";
        let newDesc = "";
        
        if (quotedMessageId) {
            const quotedMsg = chat_messages[botId].find(m => m.messageId === quotedMessageId);
            if (quotedMsg && quotedMsg.codigo) {
                code = quotedMsg.codigo;
                newDesc = args;
            }
        } else {
            code = parts[1];
            newDesc = parts.slice(2).join(" ");
        }

        if (!code || !newDesc) {
            responseText = `⚠️ *Uso correto:* \`.role.alterar <código_do_rolê> <nova_descrição>\` ou cite a mensagem do evento e digite \`.role.alterar <nova_descrição>\`.`;
        } else {
            const role = db_roles.find(r => r.id_bot === botId && r.codigo.toLowerCase() === code.toLowerCase().replace("#", ""));
            if (!role) {
                responseText = `⚠️ Rolê *${code}* não encontrado no grupo!`;
            } else {
                role.descricao = newDesc;
                saveDB();
                responseText = `✅ Rolê *#${role.codigo}* alterado com sucesso!\nNova descrição: "${newDesc}"`;
            }
        }
    }
    else if (cmd === ".role.excluir") {
        let code = "";
        
        if (quotedMessageId) {
            const quotedMsg = chat_messages[botId].find(m => m.messageId === quotedMessageId);
            if (quotedMsg && quotedMsg.codigo) {
                code = quotedMsg.codigo;
            }
        } else {
            code = args;
        }

        if (!code) {
            responseText = `⚠️ *Uso correto:* \`.role.excluir <código_do_rolê>\` ou cite a mensagem do evento e digite \`.role.excluir\`.`;
        } else {
            const cleanCode = code.toLowerCase().replace("#", "");
            const exists = db_roles.some(r => r.id_bot === botId && r.codigo.toLowerCase() === cleanCode);
            if (!exists) {
                responseText = `⚠️ Rolê *${code}* não encontrado.`;
            } else {
                db_roles = db_roles.filter(r => !(r.id_bot === botId && r.codigo.toLowerCase() === cleanCode));
                saveDB();
                responseText = `❌ Rolê *#${code.toUpperCase()}* excluído com sucesso!`;
            }
        }
    }
    else if (cmd === ".agendamentos" || cmd === ".agds") {
        const list = db_schedulers.filter(s => s.id_bot === botId);
        if (list.length === 0) {
            responseText = `📅 *Agendamentos Ativos:* \nNenhum agendamento ativo cadastrado neste grupo.`;
        } else {
            responseText = `📅 *Agendamentos Ativos no Grupo:*\n\n` + 
                list.map(s => `- *#${s.codigo}* (${s.tipo_agendamento}): "${s.mensagem}"\n  Próxima execução: ${formatDate(s.data_hora_execucao.split("T")[0])} às ${s.data_hora_execucao.split("T")[1]}`).join("\n\n");
        }
    }
    else if (cmd === ".agendamento.excluir" || cmd === ".agd.x") {
        if (!args) {
            responseText = `⚠️ *Uso correto:* \`.agendamento.excluir <código_do_agendamento>\` (Ex: \`.agd.x #AGD-1\`)`;
        } else {
            const cleanCode = args.toLowerCase().replace("#", "");
            const exists = db_schedulers.some(s => s.id_bot === botId && s.codigo.toLowerCase() === cleanCode);
            if (!exists) {
                responseText = `⚠️ Agendamento *${args}* não encontrado no grupo.`;
            } else {
                db_schedulers = db_schedulers.filter(s => !(s.id_bot === botId && s.codigo.toLowerCase() === cleanCode));
                saveDB();
                responseText = `❌ Agendamento *#${args.toUpperCase().replace("#", "")}* removido com sucesso.`;
                renderDashboard();
            }
        }
    }
    else {
        if (cmd.startsWith(".")) {
            responseText = `⚠️ Comando *${cmd}* não reconhecido.`;
        }
    }

    if (responseText) {
        if (isPrivate) {
            chat_messages[botId].push({
                sender: "private-warning",
                text: `🔐 (Mensagem Privada enviada para @${participant.nome}):\n\n${responseText}`
            });
        } else {
            chat_messages[botId].push({
                sender: "received",
                senderName: bot.nome_do_bot,
                senderPhone: "bot",
                text: responseText,
                time: getCurrentTime()
            });
        }
        renderMessages();
    }
};

const sendGroupEventCard = (botId, role) => {
    const formattedDate = formatDate(role.data_hora.split("T")[0]) + " às " + role.data_hora.split("T")[1];
    
    chat_messages[botId].push({
        messageId: "msg-" + Date.now(),
        sender: "event-card",
        senderName: "WhatsApp Evento 📅",
        senderPhone: "bot",
        codigo: role.codigo,
        eventData: {
            codigo: role.codigo,
            descricao: role.descricao,
            imagem_url: role.imagem_url,
            data_formatada: formattedDate
        },
        text: role.descricao,
        time: getCurrentTime()
    });
    
    renderMessages();
};

const getZodiacSign = (day, month) => {
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Áries ♈";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Touro ♉";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gêmeos ♊";
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Câncer ♋";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leão ♌";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgem ♍";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra ♎";
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Escorpião ♏";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagitário ♐";
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricórnio ♑";
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquário ♒";
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Peixes ♓";
    return "Desconhecido";
};

const runSchedulersCheck = () => {
    if (!selectedBotId) return;
    const now = new Date();
    let updated = false;

    db_schedulers.forEach(sch => {
        if (sch.id_bot !== selectedBotId) return;
        const execDate = new Date(sch.data_hora_execucao);
        if (now >= execDate) {
            executeScheduledMessage(sch);
            
            if (sch.tipo_agendamento === "Diário") {
                execDate.setDate(execDate.getDate() + 1);
            } else if (sch.tipo_agendamento === "Semanal") {
                execDate.setDate(execDate.getDate() + 7);
            } else if (sch.tipo_agendamento === "Mensal") {
                execDate.setMonth(execDate.getMonth() + 1);
            } else if (sch.tipo_agendamento === "Anual") {
                execDate.setFullYear(execDate.getFullYear() + 1);
            } else {
                db_schedulers = db_schedulers.filter(s => s.codigo !== sch.codigo);
            }
            
            if (sch.tipo_agendamento !== "Único") {
                sch.data_hora_execucao = execDate.toISOString().substring(0, 16);
            }
            updated = true;
        }
    });

    if (updated) {
        saveDB();
        renderDashboard();
    }
};

const executeScheduledMessage = (sch) => {
    const botId = sch.id_bot;
    const bot = db_bots.find(b => b.id_bot === botId);
    if (!bot) return;

    chat_messages[botId].push({
        sender: "system",
        text: `⏰ [Automação Anti-Ban] Disparando agendamento #${sch.codigo} com delay humanizado ("${sch.mensagem}")`
    });

    renderMessages();

    if (sch.mensagem.startsWith(".")) {
        processGroupCommand(botId, sch.mensagem, "5511999998888", true);
    } else {
        chat_messages[botId].push({
            sender: "received",
            senderName: bot.nome_do_bot,
            senderPhone: "bot",
            text: sch.mensagem,
            time: getCurrentTime()
        });
        renderMessages();
    }
    
    logActivity(`Agendamento #${sch.codigo} executado automaticamente.`, "system");
};

// Expondo métodos auxiliares no escopo global para onClick de templates
window.quoteMessage = (messageId) => {
    const botId = selectedBotId;
    if (!botId) return;
    const msg = chat_messages[botId].find(m => m.messageId === messageId);
    if (!msg) return;
    
    quotedMessageId = messageId;
    document.getElementById("chat-reply-author").textContent = msg.senderName;
    document.getElementById("chat-reply-text").textContent = msg.text.length > 40 ? msg.text.substring(0, 40) + "..." : msg.text;
    document.getElementById("chat-reply-bar").classList.add("visible");
};

window.cancelReply = () => {
    quotedMessageId = null;
    document.getElementById("chat-reply-bar").classList.remove("visible");
};

window.reactWithQuestionMark = (messageId) => {
    const botId = selectedBotId;
    if (!botId) return;
    const msg = chat_messages[botId].find(m => m.messageId === messageId);
    if (!msg) return;

    if (!msg.reactions) msg.reactions = {};
    msg.reactions['❓'] = (msg.reactions['❓'] || 0) + 1;

    const participant = db_participants.find(p => p.id_bot === botId && p.whatsapp === msg.senderPhone);
    if (participant) {
        participant.reacoes_recebidas++;
        saveDB();
    }

    renderMessages();
    openParticipantBio(msg.senderPhone);
};

window.openParticipantBio = (phone) => {
    if (phone === "bot") return;
    const participant = db_participants.find(p => p.id_bot === selectedBotId && p.whatsapp === phone);
    if (!participant) return;

    document.getElementById("bio-view-photo").src = participant.foto_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
    document.getElementById("bio-view-name").textContent = participant.nome;
    document.getElementById("bio-view-role").textContent = participant.cargo;
    document.getElementById("bio-view-role").className = `badge ${participant.cargo === 'Administrador' ? 'badge-ativo' : 'badge-trial'}`;
    document.getElementById("bio-view-phone").textContent = formatWhatsappNumber(participant.whatsapp);

    if (participant.instagram) {
        document.getElementById("bio-view-insta-row").style.display = "block";
        document.getElementById("bio-view-insta").textContent = `@${participant.instagram}`;
        document.getElementById("bio-view-insta").href = `https://instagram.com/${participant.instagram}`;
    } else {
        document.getElementById("bio-view-insta-row").style.display = "none";
    }

    if (participant.aniversario_dia && participant.aniversario_mes) {
        document.getElementById("bio-view-niver-row").style.display = "block";
        const dayStr = String(participant.aniversario_dia).padStart(2, '0');
        const monthStr = String(participant.aniversario_mes).padStart(2, '0');
        document.getElementById("bio-view-niver").textContent = `${dayStr}/${monthStr}`;

        document.getElementById("bio-view-signo-row").style.display = "block";
        document.getElementById("bio-view-signo").textContent = getZodiacSign(participant.aniversario_dia, participant.aniversario_mes);
    } else {
        document.getElementById("bio-view-niver-row").style.display = "none";
        document.getElementById("bio-view-signo-row").style.display = "none";
    }

    document.getElementById("bio-view-text").textContent = participant.bio || "Nenhuma informação configurada.";

    openModal("modal-bio-view");
};

window.handleReactionClick = (phone) => {
    openParticipantBio(phone);
};


// --------------------------------------------------
// UTILS / FUNÇÕES AUXILIARES
// --------------------------------------------------
const formatWhatsappNumber = (num) => {
    const clean = num.replace(/\D/g, "");
    if (clean.length === 13) {
        return `+${clean.substring(0, 2)} (${clean.substring(2, 4)}) ${clean.substring(4, 9)}-${clean.substring(9)}`;
    } else if (clean.length === 11) {
        return `(${clean.substring(0, 2)}) ${clean.substring(2, 7)}-${clean.substring(7)}`;
    }
    return num;
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
};

const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().substring(0, 5);
};
