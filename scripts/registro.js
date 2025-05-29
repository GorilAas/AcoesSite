/**
 * SISTEMA DE REGISTRO - SIMULADOR DE AÇÕES
 * 
 * Este arquivo contém as funções responsáveis pelo cadastro de novos usuários.
 * Aqui são realizadas as validações para evitar usuários duplicados e
 * o armazenamento dos dados no navegador.
 * 
 * CONCEITOS IMPORTANTES PARA INICIANTES:
 * 
 * 1. localStorage: Armazena dados permanentemente no navegador
 * 2. JSON.stringify(): Converte objeto JavaScript para texto JSON
 * 3. JSON.parse(): Converte texto JSON de volta para objeto JavaScript
 * 4. .some(): Método que verifica se PELO MENOS um item do array atende à condição
 * 5. .push(): Adiciona um novo item ao final de um array
 * 6. setTimeout(): Executa uma função depois de um tempo determinado
 * 7. .className: Propriedade que define as classes CSS de um elemento
 */

/**
 * Função principal responsável pelo registro de novos usuários
 * 
 * @param {Event} event - O evento do formulário (quando o usuário clica em "Registrar")
 * 
 * COMO FUNCIONA:
 * 1. Impede que a página recarregue
 * 2. Pega os dados digitados pelo usuário
 * 3. Verifica se já existe um usuário com esse nome
 * 4. Se já existir: mostra erro
 * 5. Se não existir: salva o novo usuário e redireciona para login
 */
function registrarUsuario(event) {
    // Impede que a página recarregue quando o formulário for enviado
    // Isso é necessário para que possamos processar os dados com JavaScript
    event.preventDefault();
    
    // Pega os valores dos campos e remove espaços extras
    // .trim() é importante para evitar nomes de usuário com espaços desnecessários
    const usuario = document.getElementById('novoUsuario').value.trim();
    const senha = document.getElementById('novaSenha').value.trim();
    
    // Pega o elemento onde vamos mostrar mensagens para o usuário
    const mensagem = document.getElementById('mensagem');
    
    // Busca a lista atual de usuários no localStorage
    // Se não existir nenhum usuário ainda, cria uma lista vazia []
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    
    // Verifica se já existe um usuário com o mesmo nome
    // .some() retorna true se PELO MENOS um usuário tiver o mesmo nome
    // É como perguntar: "Existe algum usuário com esse nome?"
    const jaExiste = usuarios.some(u => u.username === usuario);
    
    if (jaExiste) {
        // USUÁRIO JÁ EXISTE - MOSTRAR ERRO
        
        // Muda a classe CSS para mostrar a mensagem em vermelho (erro)
        mensagem.className = "mensagem-erro";
        
        // Define o texto da mensagem de erro
        mensagem.textContent = "Usuário já existe. Escolha outro nome.";
        
        // Para a execução da função aqui (não continua o cadastro)
        return;
    }
    
    // USUÁRIO NÃO EXISTE - PODE CADASTRAR
    
    // Adiciona o novo usuário ao final da lista
    // .push() coloca o novo objeto { username: ..., password: ... } na lista
    usuarios.push({ 
        username: usuario, 
        password: senha 
    });
    
    // Salva a lista atualizada no localStorage
    // JSON.stringify() converte o array JavaScript para texto JSON
    // Isso é necessário porque o localStorage só aceita texto
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    
    // Mostra mensagem de sucesso em verde
    mensagem.className = "mensagem-sucesso";
    mensagem.textContent = "Usuário registrado com sucesso!";
    
    // Limpa os campos do formulário para uma nova possível utilização
    document.getElementById('novoUsuario').value = "";
    document.getElementById('novaSenha').value = "";
    
    // Redireciona para a página de login após 2 segundos (2000 milissegundos)
    // setTimeout() permite que o usuário veja a mensagem de sucesso antes de sair
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
}