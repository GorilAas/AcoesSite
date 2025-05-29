/**
 * SIMULADOR DE AÇÕES - SCRIPT DA CARTEIRA
 * Este arquivo controla toda a funcionalidade da página "Minha Carteira"
 * Permite visualizar, agrupar e vender ações compradas pelo usuário
 */

// ================================
// VERIFICAÇÕES DE SEGURANÇA
// ================================

/**
 * Verifica se o usuário está logado no sistema
 * Se não estiver, redireciona para a página de login
 */
function verificarLogin() {
    const usuario = sessionStorage.getItem("usuarioLogado");
    if (!usuario) {
        window.location.href = "index.html";
    }
}

// ================================
// FUNÇÕES DE CÁLCULO E ESTATÍSTICAS
// ================================

/**
 * Calcula e exibe o resumo estatístico da carteira do usuário
 * Mostra: total de ações, empresas únicas, valor total, etc.
 */
function exibirResumoCarteira(carteira) {
    const resumoContainer = document.getElementById('resumo-carteira');
    
    // Se não há ações na carteira, esconde o resumo
    if (carteira.length === 0) {
        resumoContainer.style.display = 'none';
        return;
    }
    
    resumoContainer.style.display = 'block';
    
    // ---- CÁLCULOS ESTATÍSTICOS ----
    
    // Conta quantas ações existem no total
    const totalAcoes = carteira.length;
    
    // Soma o valor de todas as ações
    const valorTotal = carteira.reduce((sum, acao) => sum + parseFloat(acao.preco), 0);
    
    // Conta quantas empresas diferentes existem na carteira
    const acoesUnicas = new Set(carteira.map(acao => acao.simbolo)).size;
    
    // Calcula o valor médio por ação
    const valorMedio = totalAcoes > 0 ? valorTotal / totalAcoes : 0;
    
    // Pega a moeda da primeira ação (ou USD como padrão)
    const moeda = carteira[0]?.moeda || 'USD';
    
    // ---- ENCONTRAR AÇÕES MAIS CARA E MAIS BARATA ----
    
    let maisCaraAcao = null;
    let maisBarataAcao = null;
    
    if (carteira.length > 0) {
        // Encontra a ação com maior preço
        maisCaraAcao = carteira.reduce((max, acao) => 
            parseFloat(acao.preco) > parseFloat(max.preco) ? acao : max, carteira[0]);
        
        // Encontra a ação com menor preço
        maisBarataAcao = carteira.reduce((min, acao) => 
            parseFloat(acao.preco) < parseFloat(min.preco) ? acao : min, carteira[0]);
    }
    
    // ---- MONTAGEM DO HTML DO RESUMO ----
    
    resumoContainer.innerHTML = 
        '<h3><i class="fas fa-chart-pie"></i> Resumo da Carteira</h3>' +
        '<div class="stats">' +
            // Total de ações compradas
            '<div class="stat-item">' +
                '<div class="stat-number">' + totalAcoes + '</div>' +
                '<div class="stat-label">Total de Ações</div>' +
            '</div>' +
            
            // Número de empresas diferentes
            '<div class="stat-item">' +
                '<div class="stat-number">' + acoesUnicas + '</div>' +
                '<div class="stat-label">Empresas Únicas</div>' +
            '</div>' +
            
            // Valor total investido
            '<div class="stat-item">' +
                '<div class="stat-number">' + moeda + ' ' + valorTotal.toFixed(2) + '</div>' +
                '<div class="stat-label">Valor Total Investido</div>' +
            '</div>' +
            
            // Valor médio por ação
            '<div class="stat-item">' +
                '<div class="stat-number">' + moeda + ' ' + valorMedio.toFixed(2) + '</div>' +
                '<div class="stat-label">Valor Médio por Ação</div>' +
            '</div>' +
            
            // Ação mais cara (se existir)
            (maisCaraAcao ? 
                '<div class="stat-item">' +
                    '<div class="stat-number">' + maisCaraAcao.simbolo + '</div>' +
                    '<div class="stat-label">Ação Mais Cara (' + moeda + ' ' + parseFloat(maisCaraAcao.preco).toFixed(2) + ')</div>' +
                '</div>' : '') +
            
            // Ação mais barata (se existir)
            (maisBarataAcao ? 
                '<div class="stat-item">' +
                    '<div class="stat-number">' + maisBarataAcao.simbolo + '</div>' +
                    '<div class="stat-label">Ação Mais Barata (' + moeda + ' ' + parseFloat(maisBarataAcao.preco).toFixed(2) + ')</div>' +
                '</div>' : '') +
        '</div>';
}

/**
 * Agrupa as ações por símbolo da empresa (ex: todas as ações da AAPL juntas)
 * Calcula quantidade, valor total e preço médio para cada grupo
 */
function agruparAcoesPorSimbolo(carteira) {
    const grupos = {};
    
    // Para cada ação na carteira...
    carteira.forEach((acao, index) => {
        const simbolo = acao.simbolo;
        
        // Se ainda não existe um grupo para esse símbolo, cria um novo
        if (!grupos[simbolo]) {
            grupos[simbolo] = {
                simbolo: simbolo,           // Nome da empresa (ex: AAPL)
                acoes: [],                  // Lista de todas as ações dessa empresa
                quantidade: 0,              // Quantas ações dessa empresa o usuário tem
                valorTotal: 0,              // Valor total investido nessa empresa
                precoMedio: 0,              // Preço médio pago por ação dessa empresa
                moeda: acao.moeda || 'USD'  // Moeda usada
            };
        }
        
        // Adiciona esta ação ao grupo correspondente
        grupos[simbolo].acoes.push({...acao, indiceOriginal: index});
        grupos[simbolo].quantidade++;
        grupos[simbolo].valorTotal += parseFloat(acao.preco);
    });
    
    // Calcula o preço médio para cada grupo de ações
    Object.values(grupos).forEach(grupo => {
        grupo.precoMedio = grupo.quantidade > 0 ? grupo.valorTotal / grupo.quantidade : 0;
    });
    
    return grupos;
}

// ================================
// FUNÇÕES DE EXIBIÇÃO NA TELA
// ================================

/**
 * Função principal que exibe toda a carteira do usuário na tela
 * Mostra as ações agrupadas por empresa com suas estatísticas
 */
function exibirCarteira() {
    // Pega a carteira salva no navegador (ou uma lista vazia)
    const carteira = JSON.parse(sessionStorage.getItem('carteira')) || [];
    const container = document.getElementById('minha-carteira');
    container.innerHTML = "";
    
    // Exibe o resumo estatístico da carteira
    exibirResumoCarteira(carteira);
    
    // Se não há ações compradas, mostra mensagem informativa
    if (carteira.length === 0) {
        container.innerHTML = "<p class='text-center'><i class='fas fa-info-circle'></i> Você ainda não comprou nenhuma ação.</p>";
        return;
    }
    
    // Agrupa as ações por empresa
    const grupos = agruparAcoesPorSimbolo(carteira);
    
    // Para cada grupo de ações (cada empresa)...
    Object.values(grupos).forEach(grupo => {
        // Cria um novo elemento HTML para mostrar as informações
        const div = document.createElement('div');
        div.className = 'acao fade-in';
        
        // ---- INFORMAÇÕES SOBRE DATAS ----
        const primeiraCompra = grupo.acoes[0].data;
        const ultimaCompra = grupo.acoes[grupo.acoes.length - 1].data;
        const moeda = grupo.moeda;
        
        // ---- CONTEÚDO CONDICIONAL ----
        // (só aparece se o usuário tem mais de 1 ação da mesma empresa)
        
        let ultimaCompraHtml = '';
        if (grupo.quantidade > 1) {
            ultimaCompraHtml = '<p><i class="fas fa-calendar-alt"></i> Última compra: ' + ultimaCompra + '</p>';
        }
        
        let botaoVenderTodasHtml = '';
        if (grupo.quantidade > 1) {
            botaoVenderTodasHtml = '<button onclick="venderTodas(\'' + grupo.simbolo + '\')" class="vender-todas">' +
                                  '<i class="fas fa-trash"></i> Vender Todas (' + grupo.quantidade + ')' +
                                  '</button>';
        }
        
        // ---- MONTAGEM DO HTML DA AÇÃO ----
        div.innerHTML = 
            // Badge mostrando quantas ações dessa empresa o usuário tem
            '<div class="quantidade-badge">' + grupo.quantidade + '</div>' +
            
            // Nome da empresa
            '<h3><i class="fas fa-building"></i> ' + grupo.simbolo + '</h3>' +
            
            // Quantidade de ações
            '<p><i class="fas fa-chart-line"></i> Quantidade: <strong>' + grupo.quantidade + ' ação(ões)</strong></p>' +
            
            // Valor total investido nessa empresa
            '<p><i class="fas fa-dollar-sign"></i> Valor total investido: <strong>' + moeda + ' ' + grupo.valorTotal.toFixed(2) + '</strong></p>' +
            
            // Preço médio pago por ação
            '<p><i class="fas fa-calculator"></i> Preço médio: <strong>' + moeda + ' ' + grupo.precoMedio.toFixed(2) + '</strong></p>' +
            
            // Data da primeira compra
            '<p><i class="fas fa-calendar-alt"></i> Primeira compra: ' + primeiraCompra + '</p>' +
            
            // Data da última compra (só se tiver mais de 1 ação)
            ultimaCompraHtml +
            
            // Botões para vender ações
            '<div style="margin-top: 15px;">' +
                '<button onclick="venderUma(\'' + grupo.simbolo + '\')">' +
                    '<i class="fas fa-minus"></i> Vender 1' +
                '</button>' +
                botaoVenderTodasHtml +
            '</div>';
        
        // Adiciona este elemento na página
        container.appendChild(div);
    });
}

// ================================
// FUNÇÕES DE VENDA DE AÇÕES
// ================================

/**
 * Vende apenas UMA ação de uma empresa específica
 * Remove sempre a ação mais antiga (primeira que foi comprada)
 */
function venderUma(simbolo) {
    // Pega a carteira atual do navegador
    let carteira = JSON.parse(sessionStorage.getItem('carteira')) || [];
    
    // Encontra a primeira ação dessa empresa (a mais antiga)
    const indiceParaRemover = carteira.findIndex(acao => acao.simbolo === simbolo);
    
    // Se encontrou a ação...
    if (indiceParaRemover !== -1) {
        // Pega os dados da ação que será vendida
        const acaoVendida = carteira[indiceParaRemover];
        
        // Remove essa ação da carteira
        carteira.splice(indiceParaRemover, 1);
        
        // Salva a carteira atualizada no navegador
        sessionStorage.setItem('carteira', JSON.stringify(carteira));
        
        // Mostra uma mensagem de sucesso para o usuário
        mostrarNotificacao('Você vendeu 1 ação de ' + simbolo + ' por ' + acaoVendida.moeda + ' ' + parseFloat(acaoVendida.preco).toFixed(2), 'success');
        
        // Atualiza a tela para mostrar as mudanças
        exibirCarteira();
    }
}

/**
 * Vende TODAS as ações de uma empresa específica
 * Pede confirmação do usuário antes de fazer a venda
 */
function venderTodas(simbolo) {
    // Pede confirmação do usuário
    if (confirm('Tem certeza que deseja vender todas as ações de ' + simbolo + '?')) {
        // Pega a carteira atual
        let carteira = JSON.parse(sessionStorage.getItem('carteira')) || [];
        
        // ---- CÁLCULOS PARA A MENSAGEM DE CONFIRMAÇÃO ----
        
        // Filtra apenas as ações dessa empresa
        const acoesDoSimbolo = carteira.filter(acao => acao.simbolo === simbolo);
        
        // Calcula o valor total que será recebido
        const valorTotal = acoesDoSimbolo.reduce((sum, acao) => sum + parseFloat(acao.preco), 0);
        
        // Conta quantas ações serão vendidas
        const quantidade = acoesDoSimbolo.length;
        
        // Pega a moeda
        const moeda = acoesDoSimbolo[0]?.moeda || 'USD';
        
        // ---- REMOÇÃO DAS AÇÕES ----
        
        // Remove todas as ações dessa empresa da carteira
        carteira = carteira.filter(acao => acao.simbolo !== simbolo);
        
        // Salva a carteira atualizada
        sessionStorage.setItem('carteira', JSON.stringify(carteira));
        
        // Mostra mensagem de sucesso
        mostrarNotificacao('Você vendeu ' + quantidade + ' ações de ' + simbolo + ' por um total de ' + moeda + ' ' + valorTotal.toFixed(2), 'success');
        
        // Atualiza a tela
        exibirCarteira();
    }
}

// ================================
// SISTEMA DE NOTIFICAÇÕES
// ================================

/**
 * Mostra uma notificação temporária na tela
 * Pode ser de sucesso, erro ou informação
 */
function mostrarNotificacao(texto, tipo = 'info') {
    // Cria o elemento da notificação
    const mensagem = document.createElement('div');
    mensagem.className = `notificacao ${tipo}`;
    
    // Define os ícones para cada tipo de notificação
    const icones = {
        success: 'fa-check-circle',     // Ícone de sucesso (✓)
        error: 'fa-exclamation-circle', // Ícone de erro (!)
        info: 'fa-info-circle'          // Ícone de informação (i)
    };
    
    // Monta o HTML da notificação com ícone e texto
    mensagem.innerHTML = `<i class="fas ${icones[tipo]}"></i> ${texto}`;
    
    // Adiciona a notificação na página
    document.body.appendChild(mensagem);
    
    // Remove a notificação após 4 segundos
    setTimeout(() => {
        if (document.body.contains(mensagem)) {
            document.body.removeChild(mensagem);
        }
    }, 4000);
}

// ================================
// INICIALIZAÇÃO DA PÁGINA
// ================================

/**
 * Função que roda quando a página termina de carregar
 * Verifica se o usuário está logado e exibe a carteira
 */
window.onload = function() {
    // Primeiro verifica se o usuário está logado
    verificarLogin();
    
    // Depois exibe a carteira do usuário
    exibirCarteira();
};