# 📈 Simulador de Ações

Um simulador de investimentos em ações desenvolvido com HTML, CSS e JavaScript vanilla. Este projeto permite que usuários simulem compras e vendas de ações em um ambiente seguro e educativo.

## 🎯 Sobre o Projeto

Este simulador foi desenvolvido como uma ferramenta educacional para ensinar conceitos básicos de investimentos em ações. Os usuários podem criar contas, fazer login, comprar ações fictícias e acompanhar seu portfólio sem riscos financeiros reais.

## ✨ Funcionalidades

- **Sistema de Autenticação**
  - Registro de novos usuários
  - Login seguro com validação
  - Proteção de páginas com verificação de sessão
  - Logout com limpeza de dados

- **Gestão de Usuários**
  - Validação de usuários únicos
  - Armazenamento local de dados
  - Sessões temporárias de usuário

- **Interface Responsiva**
  - Design adaptável para diferentes dispositivos
  - Feedback visual para ações do usuário
  - Animações e transições suaves

## 🚀 Como Usar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, mas recomendado)

### Instalação

1. **Clone ou baixe o projeto**
   ```bash
   git clone https://github.com/GorilAas/AcoesSite.git
   # ou baixe e extraia o ZIP
   ```

2. **Estrutura de pastas**
   ```
   ├── 📄 login.html          # Página de login
   ├── 📄 registro.html       # Página de cadastro
   ├── 📄 home.html          # Página inicial
   ├── 📄 acoes.html         # Página de compra de ações
   ├── 📄 carteira.html      # Página da carteira
   ├── 📁 CSS/
   │   └── 📄 style.css      # Estilos da aplicação
   └── 📁 scripts/
       ├── 📄 login.js       # Lógica de login
       ├── 📄 registro.js    # Lógica de registro
       └── 📄 home.js        # Lógica da página inicial
   ```

3. **Executar o projeto**
   - **Opção 1:** Abrir `login.html` diretamente no navegador
   - **Opção 2:** Usar um servidor local (recomendado)
     ```bash
     # Com Python 3
     python -m http.server 8000
     
     # Com Node.js (http-server)
     npx http-server
     
     # Com PHP
     php -S localhost:8000
     ```

### Primeiro Acesso

1. Acesse `login.html` ou a URL do servidor local
2. Clique em "Registre-se aqui" para criar uma conta
3. Preencha os dados e clique em "Registrar"
4. Faça login com suas credenciais
5. Explore o simulador!

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica das páginas
- **CSS3**: Estilização responsiva e animações
- **JavaScript ES6+**: Lógica da aplicação e interatividade

### Bibliotecas Externas
- **Font Awesome 6.0.0**: Ícones da interface

### Armazenamento
- **localStorage**: Dados permanentes (usuários cadastrados)
- **sessionStorage**: Dados temporários (sessão do usuário)

## 📚 Estrutura do Código

### JavaScript Modularizado

Cada página possui seu próprio arquivo JavaScript com código bem documentado:

- **`login.js`**: Autenticação de usuários
- **`registro.js`**: Cadastro de novos usuários  
- **`home.js`**: Verificação de sessão e logout

### Padrões Utilizados

- Separação de responsabilidades (HTML/CSS/JS)
- Código comentado para fins educacionais
- Nomenclatura clara e consistente
- Validações no frontend
- Feedback visual para o usuário

## 🎨 Características do Design

- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Moderno**: Interface limpa e intuitiva
- **Acessível**: Bom contraste e navegação clara
- **Interativo**: Feedback visual e animações suaves

## 🔒 Segurança

### Implementada
- Validação de dados no frontend
- Verificação de usuários únicos
- Proteção de páginas com autenticação
- Limpeza de sessão no logout

### ⚠️ Importante - Segurança Educacional
Este projeto foi desenvolvido para **fins educacionais**. Em um ambiente de produção real, seria necessário implementar:

- Criptografia de senhas
- Autenticação no servidor
- Tokens de sessão seguros
- Validação server-side
- Proteção contra ataques comuns (XSS, CSRF)
- HTTPS obrigatório

## 🤝 Contribuições

Este projeto aceita contribuições! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Ideias para Contribuições

- Implementar simulação de compra/venda de ações
- Adicionar gráficos de desempenho
- Criar sistema de rankings
- Melhorar responsividade mobile
- Adicionar mais validações
- Implementar temas (dark/light mode)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- GorilAas - *Desenvolvimento inicial* - https://github.com/GorilAas

## 🆘 Suporte

Se encontrar algum problema ou tiver dúvidas:

1. Verifique se todos os arquivos estão na estrutura correta
2. Teste em um navegador diferente
3. Abra as ferramentas de desenvolvedor (F12) para ver erros no console
4. Abra uma issue no repositório

## 📝 Changelog

### v1.0.0 (Data Atual)
- ✅ Sistema de login e registro
- ✅ Autenticação com sessionStorage
- ✅ Interface responsiva
- ✅ Código documentado
- ✅ Estrutura modularizada

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!**

**🐛 Encontrou um bug? Abra uma issue!**

**💡 Tem uma ideia? Contribua com o projeto!**
