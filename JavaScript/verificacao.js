// O localStorage simula um banco de dados simples (inseguro para produção, apenas para demonstração)
const LS_KEY = 'universoEscolarUser'; //

// --- Funções Auxiliares para Mensagens ---
function showMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message; //
        el.className = `mt-3 alert alert-${type} d-block`;
        setTimeout(() => {
            el.className = 'mt-3 alert d-none';
        }, 5000); //
    }
}

// --- Lógica de CADASTRO ---
const cadastroForm = document.getElementById('cadastroForm'); //
if (cadastroForm) {
    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('cadastroNome').value;
        const email = document.getElementById('cadastroEmail').value;
        const senha = document.getElementById('cadastroSenha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value; //

        if (senha !== confirmarSenha) {
            showMessage('cadastroMessage', 'As senhas não coincidem.', 'danger'); //
            return;
        }
        
        // Simulação: Verifica se já existe um usuário
        if (localStorage.getItem(LS_KEY)) {
            // MENSAGEM CORRIGIDA AQUI
            showMessage('cadastroMessage', 'Já existe um usuário cadastrado. Por favor, faça login.', 'danger');
            return;
        }

        // Armazena no localStorage (simulação de DB)
        const user = {
            nome: nome,
            email: email,
            // A senha é codificada em Base64 apenas para simular um armazenamento não-plaintext.
            // Em produção, deve-se usar criptografia robusta (ex: bcrypt no backend).
            senha: btoa(senha) 
        };
        localStorage.setItem(LS_KEY, JSON.stringify(user)); //

        showMessage('cadastroMessage', 'Cadastro realizado com sucesso! Redirecionando para o login...', 'success'); //

        setTimeout(() => {
            window.location.href = 'login.html'; //
        }, 1500);
    });
}

// --- Lógica de LOGIN ---
const loginForm = document.getElementById('loginForm'); //
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginSenha').value; //

        const storedUserJSON = localStorage.getItem(LS_KEY);
        
        if (!storedUserJSON) {
            // Se nenhum usuário estiver cadastrado
            showMessage('loginMessage', 'Nenhum usuário cadastrado. Por favor, cadastre-se.', 'warning');
            return;
        }

        const storedUser = JSON.parse(storedUserJSON);
        const storedPasswordDecoded = atob(storedUser.senha); // Decodifica para comparação

        if (storedUser.email === email && storedPasswordDecoded === senha) {
            // Login bem-sucedido
            showMessage('loginMessage', 'Login bem-sucedido! Redirecionando...', 'success'); //
            
            // Simula o estado de autenticação (sinalização)
            localStorage.setItem('isAuthenticated', 'true'); 

            setTimeout(() => {
                window.location.href = 'index.html'; //
            }, 1500);
        } else {
            // Login falhou
            showMessage('loginMessage', 'E-mail ou senha incorretos.', 'danger'); //
        }
    });
}

// --- Lógica de RECUPERAÇÃO DE SENHA ---
const recuperarSenhaForm = document.getElementById('recuperarSenhaForm'); //
if (recuperarSenhaForm) {
    recuperarSenhaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('recuperarEmail').value;
        
        const storedUser = JSON.parse(localStorage.getItem(LS_KEY));
        
        // A mensagem é a mesma em ambos os casos (email cadastrado ou não) por segurança
        const message = 'Se o e-mail estiver cadastrado, um link de redefinição de senha foi enviado para a sua caixa de entrada.'; //
        
        if (!storedUser || storedUser.email !== email) {
            showMessage('recuperarMessage', message, 'info');
        } else {
            // Se o usuário está cadastrado (na simulação), mostramos a mensagem de sucesso
            showMessage('recuperarMessage', message, 'success');
        }

        // Redireciona de volta para o login após 3 segundos
        setTimeout(() => {
            window.location.href = 'login.html'; //
        }, 3000);
    });
}
