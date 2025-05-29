/**
 * PÁGINA INICIAL (HOME) - SIMULADOR DE AÇÕES
 * 
 * Este arquivo contém as funções responsáveis pela página inicial do sistema.
 * Aqui são realizadas as verificações de autenticação e o controle de acesso,
 * garantindo que apenas usuários logados possam acessar o sistema.
 * 
 * CONCEITOS IMPORTANTES PARA INICIANTES:
 * 
 * 1. sessionStorage: Armazena dados temporariamente (apenas durante a sessão)
 * 2. Autenticação: Verificar se o usuário está logado
 * 3. Autorização: Controlar o que o usuário pode acessar
 * 4. Redirecionamento: Enviar o usuário para outra página
 * 5. Template literals: Texto com variáveis usando `${variavel}`
 * 6. Operador NOT (!): Inverte um valor (true vira false, false vira true)
 * 7. Segurança de sessão: Proteger páginas que precisam de login
 */

/**
 * VERIFICAÇÃO DE AUTENTICAÇÃO
 * 
 * Este código roda automaticamente quando a página carrega.
 * É responsável por verificar se o usuário tem permissão para estar aqui.
 * 
 * FLUXO DE VERIFICAÇÃO:
 * 1. Busca o nome do usuário na sessão
 * 2. Se não encontrar: redireciona para login
 * 3. Se encontrar: mostra mensagem de boas-vindas personalizada
 */

// Busca o nome do usuário que está logado na sessão atual
// sessionStorage.getItem() retorna o valor salvo ou null se não existir
const usuario = sessionStorage.getItem("usuarioLogado");

// Verifica se NÃO existe um usuário logado
// O operador ! (NOT) inverte o resultado:
// - Se usuario tem valor: !usuario = false
// - Se usuario é null: !usuario = true
if (!usuario) {
    // USUÁRIO NÃO ESTÁ LOGADO - ACESSO NEGADO
    
    // Redireciona imediatamente para a página de login
    // Isso impede que pessoas não autorizadas vejam o conteúdo
    window.location.href = "index.html";
    
} else {
    // USUÁRIO ESTÁ LOGADO - ACESSO PERMITIDO
    
    // Cria uma mensagem personalizada de boas-vindas
    // Template literals (`) permitem incluir variáveis no texto usando ${variavel}
    // Isso é mais limpo que concatenar strings com +
    const mensagemBoasVindas = `Olá, ${usuario}! Bem-vindo ao seu simulador de investimentos.`;
    
    // Exibe a mensagem na página
    // .textContent define o texto que aparece dentro do elemento
    document.getElementById("boasVindas").textContent = mensagemBoasVindas;
}

/**
 * Função responsável por fazer logout do sistema
 * 
 * COMO FUNCIONA O LOGOUT:
 * 1. Remove os dados de sessão do usuário
 * 2. Redireciona para a página de login
 * 3. Impede que o usuário volte usando o botão "Voltar" do navegador
 * 
 * Esta função é chamada quando o usuário clica no botão "Sair"
 */
function logout() {
    // Remove o nome do usuário da sessão
    // sessionStorage.removeItem() apaga completamente a informação
    // Isso significa que o usuário não estará mais "logado"
    sessionStorage.removeItem("usuarioLogado");
    
    // Redireciona para a página de login
    // Como removemos a sessão, se o usuário tentar voltar,
    // será redirecionado novamente para o login
    window.location.href = "index.html";
}