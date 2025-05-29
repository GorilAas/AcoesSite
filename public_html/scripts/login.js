/**
 * SISTEMA DE LOGIN - SIMULADOR DE AÇÕES
 * 
 * Este arquivo contém as funções responsáveis pelo sistema de login da aplicação.
 * Aqui são realizadas as validações de usuário e senha, e o redirecionamento
 * após um login bem-sucedido.
 * 
 * CONCEITOS IMPORTANTES PARA INICIANTES:
 * 
 * 1. localStorage: Armazena dados permanentemente no navegador (até serem apagados)
 * 2. sessionStorage: Armazena dados temporariamente (apenas durante a sessão)
 * 3. JSON.parse(): Converte texto em formato JSON para objeto JavaScript
 * 4. event.preventDefault(): Impede o comportamento padrão de um evento
 * 5. document.getElementById(): Busca um elemento HTML pelo seu ID
 * 6. find(): Método de array que procura um item que atenda a uma condição
 */

/**
 * Função principal responsável pelo processo de login
 * 
 * @param {Event} event - O evento do formulário (quando o usuário clica em "Entrar")
 * 
 * COMO FUNCIONA:
 * 1. Impede que a página recarregue (comportamento padrão de formulários)
 * 2. Pega os valores digitados pelo usuário
 * 3. Remove espaços em branco do início e fim (.trim())
 * 4. Busca a lista de usuários salvos no navegador
 * 5. Procura se existe um usuário com as credenciais informadas
 * 6. Se encontrar: redireciona para a página principal
 * 7. Se não encontrar: mostra mensagem de erro
 */
function fazerLogin(event) {
    // Impede que a página recarregue quando o formulário for enviado
    // Isso é importante porque queremos tratar o login com JavaScript
    event.preventDefault();
    
    // Pega os valores dos campos de entrada e remove espaços extras
    // .trim() remove espaços no início e fim do texto
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();
    
    // Pega o elemento onde vamos mostrar mensagens de erro
    const mensagem = document.getElementById('mensagem');
    
    // Busca a lista de usuários salvos no localStorage
    // localStorage.getItem("usuarios") retorna o texto salvo ou null se não existir
    // JSON.parse() converte o texto JSON de volta para um array JavaScript
    // || [] significa: "se não existir nada, use um array vazio"
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    
    // Procura na lista de usuários se existe alguém com o nome e senha informados
    // .find() percorre o array e retorna o primeiro item que atender à condição
    // u => representa cada usuário na lista (é como um "para cada usuário")
    // && significa "E" - ambas condições devem ser verdadeiras
    const usuarioEncontrado = usuarios.find(u => u.username === usuario && u.password === senha);
    
    // Verifica se encontrou um usuário válido
    if (usuarioEncontrado) {
        // LOGIN BEM-SUCEDIDO!
        
        // Salva o nome do usuário na sessão atual do navegador
        // sessionStorage mantém a informação apenas enquanto a aba estiver aberta
        // Isso nos permite saber quem está logado nas outras páginas
        sessionStorage.setItem("usuarioLogado", usuario);
        
        // Redireciona o usuário para a página principal do sistema
        window.location.href = "home.html";
        
    } else {
        // LOGIN FALHOU!
        
        // Mostra uma mensagem de erro na tela
        // .textContent altera o texto que aparece dentro do elemento
        mensagem.textContent = "Usuário ou senha incorretos. Tente novamente.";
        
        // Limpa o campo de senha para que o usuário possa tentar novamente
        // Isso é uma boa prática de segurança e usabilidade
        document.getElementById('senha').value = "";
    }
}