// ===============================================
// CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// ===============================================

// Simulação de verificação de usuário logado
// Em um sistema real, isso viria do servidor
const usuario = sessionStorage.getItem("usuarioLogado") || "usuarioDemo";
if (!usuario) {
    // Se não houver usuário, redireciona para login
    window.location.href = "index.html";
}

// Configuração da API Finnhub para dados reais de ações
const FINNHUB_CONFIG = {
    baseURL: 'https://finnhub.io/api/v1',
    // IMPORTANTE: Esta é uma chave de demonstração - use sua própria chave
    apiKey: 'd0rtb69r01qumepgcmugd0rtb69r01qumepgcmv0'
};

// Controle de rate limiting (limite de requisições por minuto)
let requestCount = 0;
let lastResetTime = Date.now();

// Elementos DOM que serão utilizados frequentemente
const container = document.getElementById('lista-acoes');

// Set para controlar quais ações já foram carregadas (evita duplicatas)
let acoesCarregadas = new Set();

// Array para armazenar as ações compradas (carteira do usuário)
let carteira = [];

// Cache para melhorar performance e reduzir requisições à API
let cacheAcoes = new Map();

// ===============================================
// FUNÇÕES DE CONTROLE DE API
// ===============================================

/**
 * Verifica se ainda podemos fazer requisições à API
 * A API Finnhub tem limite de 60 requisições por minuto
 */
function checkRateLimit() {
    const now = Date.now();
    
    // Reseta o contador a cada minuto
    if (now - lastResetTime > 60000) {
        requestCount = 0;
        lastResetTime = now;
    }
    
    // Verifica se atingiu o limite (deixa margem de segurança)
    if (requestCount >= 58) {
        throw new Error('Rate limit atingido. Aguarde um momento.');
    }
    
    requestCount++;
}

/**
 * Cria headers padrão para as requisições HTTP
 */
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
}

// ===============================================
// FUNÇÕES DE INTERFACE E INTERAÇÃO
// ===============================================

/**
 * Permite buscar ação pressionando Enter no campo de pesquisa
 */
function handleEnter(event) {
    if (event.key === 'Enter') {
        buscarAcao();
    }
}

/**
 * Busca uma ação específica baseada no que o usuário digitou
 */
function buscarAcao() {
    const simbolo = document.getElementById('pesquisa').value.trim().toUpperCase();
    if (simbolo !== "") {
        carregarAcao(simbolo);
        // Limpa o campo após a busca
        document.getElementById('pesquisa').value = '';
    }
}

/**
 * Remove todas as ações da lista após confirmação do usuário
 */
function limparLista() {
    if (acoesCarregadas.size > 0) {
        if (confirm('Tem certeza que deseja remover todas as ações da lista?')) {
            // Volta ao estado inicial
            container.innerHTML = '<p class="text-center"><i class="fas fa-info-circle"></i><br>Clique em uma das ações populares acima ou pesquise por uma ação específica para começar.</p>';
            acoesCarregadas.clear();
            atualizarEstatisticas();
            mostrarNotificacao('Lista de ações limpa com sucesso!', 'info');
        }
    } else {
        mostrarNotificacao('A lista já está vazia.', 'info');
    }
}

// ===============================================
// FUNÇÕES DE API - DADOS REAIS
// ===============================================

/**
 * Busca cotação atual de uma ação usando a API Finnhub
 * Retorna preço atual, variação e percentual de mudança
 */
async function buscarCotacao(simbolo) {
    try {
        // Verifica se podemos fazer a requisição
        checkRateLimit();
        
        // Monta a URL da API
        const url = `${FINNHUB_CONFIG.baseURL}/quote?symbol=${simbolo}&token=${FINNHUB_CONFIG.apiKey}`;
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Verifica se os dados são válidos
        if (!data || data.c === 0 || data.c === null) {
            throw new Error('Dados inválidos da API');
        }

        // Extrai e calcula os dados necessários
        const precoAtual = data.c; // current price
        const precoAnterior = data.pc; // previous close
        const variacao = precoAtual - precoAnterior;
        const percentual = (variacao / precoAnterior) * 100;

        return {
            preco: precoAtual,
            variacao: variacao,
            percentual: percentual
        };
        
    } catch (error) {
        console.warn(`Erro ao buscar cotação de ${simbolo} na Finnhub:`, error.message);
        
        // Se falhar, usa dados simulados
        return buscarCotacaoSimulada(simbolo);
    }
}

/**
 * Busca informações detalhadas da empresa usando a API Finnhub
 * Inclui nome, setor, bolsa, etc.
 */
async function buscarInfoEmpresa(simbolo) {
    try {
        checkRateLimit();
        
        const url = `${FINNHUB_CONFIG.baseURL}/stock/profile2?symbol=${simbolo}&token=${FINNHUB_CONFIG.apiKey}`;
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Verifica se encontrou dados da empresa
        if (!data || !data.name) {
            throw new Error('Dados da empresa não encontrados');
        }

        return {
            name: data.name,
            ticker: simbolo,
            exchange: data.exchange || 'NASDAQ',
            currency: data.currency || 'USD',
            country: data.country || 'US',
            sector: data.finnhubIndustry || 'Technology',
            marketCapitalization: data.marketCapitalization || 0,
            weburl: data.weburl || ''
        };
        
    } catch (error) {
        console.warn(`Erro ao buscar info da empresa ${simbolo}:`, error.message);
        
        // Se falhar, usa dados simulados
        return buscarInfoEmpresaSimulada(simbolo);
    }
}

// ===============================================
// FUNÇÕES DE FALLBACK - DADOS SIMULADOS
// ===============================================

/**
 * Fornece dados simulados de cotação quando a API não está disponível
 * Useful para demonstrações e quando não há internet
 */
function buscarCotacaoSimulada(simbolo) {
    // Dados pré-definidos para ações populares
    const cotacaoSimulada = {
        'AAPL': { preco: 175.84, variacao: 2.34, percentual: 1.35 },
        'GOOGL': { preco: 138.21, variacao: -1.87, percentual: -1.33 },
        'AMZN': { preco: 127.74, variacao: 0.92, percentual: 0.72 },
        'MSFT': { preco: 378.85, variacao: 4.12, percentual: 1.10 },
        'TSLA': { preco: 248.50, variacao: -3.25, percentual: -1.29 },
        'NVDA': { preco: 875.30, variacao: 15.67, percentual: 1.82 },
        'META': { preco: 485.75, variacao: 8.45, percentual: 1.77 },
        'NFLX': { preco: 421.38, variacao: -2.15, percentual: -0.51 }
    };

    // Se a ação está no nosso banco de dados simulado, usa os dados
    if (cotacaoSimulada[simbolo]) {
        return cotacaoSimulada[simbolo];
    } else {
        // Para ações desconhecidas, gera dados aleatórios realistas
        const precoBase = Math.random() * 500 + 50; // Preço entre $50 e $550
        const variacao = (Math.random() - 0.5) * 20; // Variação entre -$10 e +$10
        return {
            preco: precoBase,
            variacao: variacao,
            percentual: (variacao / precoBase) * 100
        };
    }
}

/**
 * Fornece informações simuladas da empresa quando a API não está disponível
 */
function buscarInfoEmpresaSimulada(simbolo) {
    // Dados de empresas conhecidas
    const empresasSimuladas = {
        'AAPL': { name: 'Apple Inc.', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology' },
        'GOOGL': { name: 'Alphabet Inc.', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology' },
        'AMZN': { name: 'Amazon.com Inc.', exchange: 'NASDAQ', currency: 'USD', sector: 'Consumer Cyclical' },
        'MSFT': { name: 'Microsoft Corporation', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology' },
        'TSLA': { name: 'Tesla Inc.', exchange: 'NASDAQ', currency: 'USD', sector: 'Consumer Cyclical' },
        'NVDA': { name: 'NVIDIA Corporation', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology' },
        'META': { name: 'Meta Platforms Inc.', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology' },
        'NFLX': { name: 'Netflix Inc.', exchange: 'NASDAQ', currency: 'USD', sector: 'Communication Services' }
    };

    if (empresasSimuladas[simbolo]) {
        return {
            ...empresasSimuladas[simbolo],
            ticker: simbolo,
            country: 'US',
            marketCapitalization: 0,
            weburl: ''
        };
    } else {
        // Para empresas desconhecidas, usa um template genérico
        return {
            name: `${simbolo} Corporation`,
            ticker: simbolo,
            exchange: 'NASDAQ',
            currency: 'USD',
            country: 'US',
            sector: 'Technology',
            marketCapitalization: 0,
            weburl: ''
        };
    }
}

// ===============================================
// FUNÇÕES PRINCIPAIS DE NEGÓCIO
// ===============================================

/**
 * Carrega uma ação individual e exibe na interface
 * Esta é a função principal que coordena todo o processo
 */
async function carregarAcao(simbolo) {
    // Verifica se a ação já está sendo exibida
    if (acoesCarregadas.has(simbolo)) {
        mostrarNotificacao('A ação ' + simbolo + ' já está sendo exibida.', 'info');
        return;
    }

    // Adiciona ao conjunto de ações carregadas
    acoesCarregadas.add(simbolo);

    // Cria e exibe indicador de carregamento
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'acao';
    loadingDiv.id = 'loading-' + simbolo;
    loadingDiv.innerHTML = `
        <div class="text-center">
            <div class="loading"></div>
            <p style="margin-top: 15px;">Carregando dados de ${simbolo}...</p>
        </div>
    `;
    
    // Remove a mensagem inicial se existir
    if (container.innerHTML.includes('Clique em uma das ações')) {
        container.innerHTML = '';
    }
    
    container.appendChild(loadingDiv);

    try {
        // Busca informações da empresa e preço em paralelo (mais rápido)
        const [infoEmpresa, dadosPreco] = await Promise.all([
            buscarInfoEmpresa(simbolo),
            buscarCotacao(simbolo)
        ]);

        // Remove o indicador de carregamento
        const loadingElement = document.getElementById('loading-' + simbolo);
        if (loadingElement && container.contains(loadingElement)) {
            container.removeChild(loadingElement);
        }

        // Exibe a ação com todos os dados
        exibirAcao(simbolo, infoEmpresa, dadosPreco);
        atualizarEstatisticas();
        
        // Informa se está usando dados reais ou simulados
        const isRealData = !infoEmpresa.name.includes('Corporation') || infoEmpresa.marketCapitalization > 0;
        if (!isRealData) {
            mostrarNotificacao(`${simbolo} carregada com dados simulados (API indisponível)`, 'info');
        }
        
    } catch (erro) {
        console.error("Erro ao buscar ação:", erro);
        
        // Remove o loading em caso de erro
        const loadingElement = document.getElementById('loading-' + simbolo);
        if (loadingElement && container.contains(loadingElement)) {
            container.removeChild(loadingElement);
        }
        
        // Remove do conjunto já que falhou
        acoesCarregadas.delete(simbolo);
        
        // Mostra mensagem de erro apropriada
        if (erro.message.includes('Rate limit')) {
            mostrarNotificacao('Muitas requisições. Aguarde um momento antes de buscar mais ações.', 'error');
        } else {
            mostrarNotificacao(`Erro ao buscar a ação ${simbolo}. Verifique se o símbolo está correto.`, 'error');
        }
    }
}

/**
 * Função utilitária para escapar aspas em strings JavaScript
 * Previne erros de sintaxe quando o nome da empresa tem aspas
 */
function escapeQuotes(str) {
    return str.replace(/'/g, "\\'");
}

/**
 * Cria e exibe o card visual de uma ação com todos os dados
 * Esta função constrói o HTML completo do card da ação
 */
function exibirAcao(simbolo, dadosEmpresa, dadosPreco) {
    // Extrai e formata os dados de preço
    const { preco, variacao, percentual } = dadosPreco;
    const precoFormatado = preco.toFixed(2);
    const variacaoFormatada = variacao.toFixed(2);
    
    // Define as classes CSS baseadas se a variação é positiva ou negativa
    const variacaoClass = variacao >= 0 ? 'positiva' : 'negativa';
    const variacaoIcon = variacao >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
    
    // Cria o elemento div que vai conter toda a informação da ação
    const div = document.createElement('div');
    div.className = 'acao fade-in'; // fade-in adiciona animação de entrada
    div.id = 'acao-' + simbolo;
    
    // Extrai informações da empresa com valores padrão
    const exchange = dadosEmpresa.exchange || 'NASDAQ';
    const currency = dadosEmpresa.currency || 'USD';
    const security = dadosEmpresa.name || 'Empresa não identificada';
    const sector = dadosEmpresa.sector || 'N/A';
    
    // Escape aspas para evitar erros JavaScript
    const securityEscaped = escapeQuotes(security);
    
    // Constrói o HTML completo do card da ação
    div.innerHTML = `
        <!-- Badge de status (sempre ativo nesta versão) -->
        <div class="status-badge ativo">
            Ativo
        </div>
        
        <!-- Cabeçalho com símbolo da ação -->
        <h3><i class="fas fa-building"></i> ${simbolo}</h3>
        
        <!-- Nome da empresa -->
        <div class="empresa-nome">${security}</div>
        
        <!-- Preço atual em destaque -->
        <div class="preco-atual">${currency} ${precoFormatado}</div>
        
        <!-- Variação do preço com cor e ícone indicativo -->
        <div class="variacao ${variacaoClass}">
            <i class="fas ${variacaoIcon}"></i>
            ${currency} ${variacaoFormatada} (${percentual.toFixed(2)}%)
        </div>
        
        <!-- Detalhes adicionais da ação -->
        <div class="detalhes">
            <span><i class="fas fa-exchange-alt"></i> <strong>Bolsa:</strong> ${exchange.toUpperCase()}</span>
            <span><i class="fas fa-tag"></i> <strong>Setor:</strong> ${sector}</span>
            <span><i class="fas fa-coins"></i> <strong>Moeda:</strong> ${currency}</span>
            <span><i class="fas fa-chart-pie"></i> <strong>Ticker:</strong> ${simbolo}</span>
        </div>
        
        <!-- Botões de ação -->
        <button onclick="comprar('${simbolo}', ${precoFormatado}, '${securityEscaped}', '${currency}')">
            <i class="fas fa-shopping-cart"></i> Comprar
        </button>
        <button class="remover" onclick="removerAcao('${simbolo}')">
            <i class="fas fa-times"></i> Remover
        </button>
    `;
    
    // Adiciona o card ao container principal
    container.appendChild(div);
}

/**
 * Remove uma ação específica da lista
 */
function removerAcao(simbolo) {
    const acaoElement = document.getElementById('acao-' + simbolo);
    if (acaoElement && container.contains(acaoElement)) {
        // Remove o elemento visual
        container.removeChild(acaoElement);
        // Remove do conjunto de ações carregadas
        acoesCarregadas.delete(simbolo);
        // Atualiza as estatísticas
        atualizarEstatisticas();
        
        // Se não há mais ações, volta à mensagem inicial
        if (acoesCarregadas.size === 0) {
            container.innerHTML = '<p class="text-center"><i class="fas fa-info-circle"></i><br>Clique em uma das ações populares acima ou pesquise por uma ação específica para começar.</p>';
        }
        
        mostrarNotificacao(`Ação ${simbolo} removida da lista.`, 'info');
    }
}

/**
 * Simula a compra de uma ação
 * Em um sistema real, isso faria uma transação no servidor
 */
function comprar(simbolo, preco, nomeEmpresa, moeda = 'USD') {
    // Cria um objeto representando a compra
    const novaCompra = {
        simbolo: simbolo,
        nome: nomeEmpresa,
        preco: parseFloat(preco),
        moeda: moeda,
        data: new Date().toLocaleString('pt-BR'), // Data da compra
        id: Date.now() // ID único baseado no timestamp
    };

    // Adiciona à carteira em memória
    carteira.push(novaCompra);
    atualizarEstatisticas();
    
    // Tenta salvar no sessionStorage (persistência local)
    try {
        const carteiraLS = JSON.parse(sessionStorage.getItem('carteira')) || [];
        carteiraLS.push(novaCompra);
        sessionStorage.setItem('carteira', JSON.stringify(carteiraLS));
    } catch (e) {
        console.log('SessionStorage não disponível, usando apenas memória');
    }
    
    // Confirma a compra para o usuário
    mostrarNotificacao(`Compra realizada! ${simbolo} por ${moeda} ${preco}`, 'success');
}

// ===============================================
// FUNÇÕES DE INTERFACE E FEEDBACK
// ===============================================

/**
 * Atualiza os números das estatísticas no topo da página
 */
function atualizarEstatisticas() {
    // Atualiza número de ações na lista
    document.getElementById('total-acoes').textContent = acoesCarregadas.size;
    
    // Atualiza número de ações na carteira
    document.getElementById('total-carteira').textContent = carteira.length;
    
    // Calcula e atualiza valor total investido
    const valorTotal = carteira.reduce((total, acao) => total + acao.preco, 0);
    document.getElementById('valor-investido').textContent = 
        '$ ' + valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Exibe notificações temporárias para o usuário
 * Tipos: 'success' (verde), 'error' (vermelho), 'info' (azul)
 */
function mostrarNotificacao(texto, tipo = 'info') {
    // Cria o elemento da notificação
    const mensagem = document.createElement('div');
    mensagem.className = `notificacao ${tipo}`;
    
    // Define ícones para cada tipo de notificação
    const icones = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    // Define o conteúdo da notificação
    mensagem.innerHTML = `<i class="fas ${icones[tipo]}"></i> ${texto}`;
    
    // Adiciona ao corpo da página
    document.body.appendChild(mensagem);
    
    // Remove automaticamente após 4 segundos
    setTimeout(() => {
        if (document.body.contains(mensagem)) {
            document.body.removeChild(mensagem);
        }
    }, 4000);
}

/**
 * Carrega a carteira salva do sessionStorage
 * Restaura compras anteriores quando a página é recarregada
 */
function carregarCarteira() {
    try {
        const carteiraLS = JSON.parse(sessionStorage.getItem('carteira')) || [];
        carteira = carteiraLS;
        atualizarEstatisticas();
    } catch (e) {
        console.log('Erro ao carregar carteira do sessionStorage');
    }
}

// ===============================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ===============================================

/**
 * Função executada quando a página termina de carregar
 * Inicializa tudo que precisa estar pronto antes do usuário interagir
 */
window.onload = async () => {
    // Carrega dados salvos da carteira
    carregarCarteira();
    
    // Mostra mensagem de boas-vindas
    mostrarNotificacao('Simulador carregado com integração Finnhub!', 'success');
};