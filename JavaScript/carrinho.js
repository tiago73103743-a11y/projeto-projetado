const LS_KEY_CARRINHO = 'universoEscolarCarrinho';

// Função para formatar o valor para moeda brasileira (R$)
const formatarPreco = (preco) => {
    return `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`;
};

// --- FUNÇÕES DE LÓGICA DO CARRINHO ---

// 1. Carrega os itens do carrinho do LocalStorage
const carregarCarrinho = () => {
    const carrinhoJson = localStorage.getItem(LS_KEY_CARRINHO);
    return carrinhoJson ? JSON.parse(carrinhoJson) : [];
};

// 2. Salva os itens do carrinho no LocalStorage
const salvarCarrinho = (carrinho) => {
    localStorage.setItem(LS_KEY_CARRINHO, JSON.stringify(carrinho));
};

// 3. Adiciona um item ao carrinho (chamada pelos botões nos produtos)
window.adicionarAoCarrinho = (elemento) => {
    const id = elemento.getAttribute('data-id');
    const nome = elemento.getAttribute('data-nome');
    // Converte o preço de string para float
    const preco = parseFloat(elemento.getAttribute('data-preco')); 
    const imagem = elemento.getAttribute('data-imagem') || 'https://via.placeholder.com/70x70.png?text=Item';

    let carrinho = carregarCarrinho();
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id, nome, preco, quantidade: 1, imagem });
    }

    salvarCarrinho(carrinho);
    atualizarContadorCarrinho(carrinho);
    
    // Alerta de sucesso (opcional)
    alert(`${nome} adicionado ao carrinho!`);
};

// 4. Aumenta ou diminui a quantidade de um item
window.mudarQuantidade = (id, delta) => {
    let carrinho = carregarCarrinho();
    const item = carrinho.find(item => item.id === id);

    if (item) {
        item.quantidade += delta;
        
        if (item.quantidade <= 0) {
            // Se a quantidade for zero ou menos, remove o item
            removerDoCarrinho(id);
            return;
        }
    }
    
    salvarCarrinho(carrinho);
    // Renderiza a tela somente se estiver na página do carrinho
    if (document.getElementById('carrinho-tabela-body')) {
        renderizarCarrinho(); 
    }
};

// 5. Remove um item do carrinho
window.removerDoCarrinho = (id) => {
    let carrinho = carregarCarrinho();
    carrinho = carrinho.filter(item => item.id !== id);
    
    salvarCarrinho(carrinho);
    // Renderiza a tela somente se estiver na página do carrinho
    if (document.getElementById('carrinho-tabela-body')) {
        renderizarCarrinho(); 
    }
};

// 6. Atualiza o contador de itens no cabeçalho
const atualizarContadorCarrinho = (carrinho) => {
    const contadorEl = document.getElementById('carrinho-contador');
    if (contadorEl) {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        contadorEl.textContent = totalItens;
    }
};

// --- FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO NA PÁGINA CARRINHO ---

const renderizarCarrinho = () => {
    const carrinho = carregarCarrinho();
    const tabelaBody = document.getElementById('carrinho-tabela-body');
    const resumoTotalEl = document.getElementById('carrinho-total');
    const resumoSubtotalEl = document.getElementById('carrinho-subtotal');
    const vazioMsgEl = document.getElementById('carrinho-vazio-msg');
    const conteudoEl = document.getElementById('carrinho-conteudo');

    if (!tabelaBody || !resumoTotalEl) return; 

    // Limpa a tabela
    tabelaBody.innerHTML = '';
    
    if (carrinho.length === 0) {
        // Mostra a mensagem de carrinho vazio
        vazioMsgEl.classList.remove('d-none');
        if (conteudoEl) conteudoEl.classList.add('d-none');
        resumoSubtotalEl.textContent = formatarPreco(0);
        resumoTotalEl.textContent = formatarPreco(0);
        atualizarContadorCarrinho(carrinho);
        return;
    }

    vazioMsgEl.classList.add('d-none');
    if (conteudoEl) conteudoEl.classList.remove('d-none');
    
    let subtotalGeral = 0;

    carrinho.forEach(item => {
        const subtotalItem = item.preco * item.quantidade;
        subtotalGeral += subtotalItem;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.imagem}" class="carrinho-item-img me-3" alt="${item.nome}">
                    <span>${item.nome}</span>
                </div>
            </td>
            <td class="text-center">${formatarPreco(item.preco)}</td>
            <td class="text-center">
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-sm btn-outline-secondary quantidade-btn" 
                            onclick="mudarQuantidade('${item.id}', -1)">-</button>
                    <span class="mx-2">${item.quantidade}</span>
                    <button class="btn btn-sm btn-outline-secondary quantidade-btn" 
                            onclick="mudarQuantidade('${item.id}', 1)">+</button>
                </div>
            </td>
            <td class="text-end">${formatarPreco(subtotalItem)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removerDoCarrinho('${item.id}')">
                    <i class="bi-trash"></i> Retirar
                </button>
            </td>
        `;
        tabelaBody.appendChild(row);
    });

    // Atualiza os totais
    resumoSubtotalEl.textContent = formatarPreco(subtotalGeral);
    resumoTotalEl.textContent = formatarPreco(subtotalGeral);
    
    atualizarContadorCarrinho(carrinho);
};


// Inicialização: Se estiver na página de carrinho, renderiza; caso contrário, só atualiza o contador.
document.addEventListener('DOMContentLoaded', () => {
    const carrinho = carregarCarrinho();
    atualizarContadorCarrinho(carrinho);
    
    // Verifica se estamos na página do carrinho para renderizar a tabela
    if (document.getElementById('carrinho-tabela-body')) {
        renderizarCarrinho();
    }
});