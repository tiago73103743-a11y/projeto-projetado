// js/carrinho.js
// FUNÇÕES DE PERSISTÊNCIA E LÓGICA DE CARRINHO

let carrinho = [];

function carregarCarrinho() {
    const carrinhoJSON = localStorage.getItem('carrinhoUniversoEscolar');
    if (carrinhoJSON) {
        carrinho = JSON.parse(carrinhoJSON);
    } else {
        carrinho = [];
    }
}

function salvarCarrinho() {
    localStorage.setItem('carrinhoUniversoEscolar', JSON.stringify(carrinho));
}

// =======================================================
// CONTADOR
// =======================================================

function updateCartCounterDisplay() {
    const savedCount = localStorage.getItem('cart_count');
    const count = (savedCount !== null && !isNaN(parseInt(savedCount))) ? parseInt(savedCount) : 0; 
    const cartCounter = document.getElementById('carrinho-contador');
    if (cartCounter) {
        cartCounter.textContent = count;
    }
}

function atualizarContador() {
    let totalItens = 0;
    carrinho.forEach(item => {
        totalItens += item.quantidade;
    });
    localStorage.setItem('cart_count', totalItens);
    updateCartCounterDisplay();
}


// =======================================================
// LÓGICA DE NEGÓCIO (ADICIONAR/REMOVER)
// =======================================================

function adicionarAoCarrinho(elementoBotao) {
    carregarCarrinho();
    
    const id = elementoBotao.dataset.id;
    const nome = elementoBotao.dataset.nome;
    const preco = parseFloat(elementoBotao.dataset.preco);
    const imagem = elementoBotao.dataset.imagem;

    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarContador();
    alert(`"${nome}" adicionado ao carrinho!`);
}

function removerItem(id) {
    carregarCarrinho();
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    atualizarContador();
    if (document.getElementById('tabela-carrinho')) {
        exibirCarrinho();
    }
}

function atualizarQuantidade(id, novaQuantidade) {
    carregarCarrinho();
    const quantidade = parseInt(novaQuantidade);
    const item = carrinho.find(item => item.id === id);

    if (item && quantidade >= 1) {
        item.quantidade = quantidade;
    } else if (item && quantidade === 0) {
        removerItem(id);
        return;
    }
    
    salvarCarrinho();
    atualizarContador();
    if (document.getElementById('tabela-carrinho')) {
        exibirCarrinho(); 
    }
}

// =======================================================
// EXIBIÇÃO DO CARRINHO (PARA carrinho.html)
// =======================================================

function exibirCarrinho() {
    carregarCarrinho();
    const corpoTabela = document.getElementById('carrinho-corpo-tabela');
    const totalElemento = document.getElementById('carrinho-total');

    if (!corpoTabela || !totalElemento) return; 

    corpoTabela.innerHTML = ''; 

    let subtotalGeral = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        subtotalGeral += subtotal;

        const precoUnitarioFormatado = item.preco.toFixed(2).replace('.', ',');
        const subtotalFormatado = subtotal.toFixed(2).replace('.', ',');

        const linha = `
            <tr>
                <td><img src="${item.imagem}" alt="${item.nome}" style="width: 50px;"></td>
                <td>${item.nome}</td>
                <td>R$ ${precoUnitarioFormatado}</td>
                <td>
                    <input type="number" value="${item.quantidade}" min="1" 
                           onchange="atualizarQuantidade('${item.id}', this.value)" 
                           style="width: 60px;">
                </td>
                <td>R$ ${subtotalFormatado}</td>
                <td><button onclick="removerItem('${item.id}')" class="btn btn-sm btn-danger">Remover</button></td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });

    const totalGeralFormatado = subtotalGeral.toFixed(2).replace('.', ',');
    totalElemento.textContent = `R$ ${totalGeralFormatado}`;
    atualizarContador();
}


// =======================================================
// INICIALIZAÇÃO GERAL
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    // Se estiver na página carrinho.html, exibe os itens
    if (document.getElementById('tabela-carrinho')) {
        exibirCarrinho();
    }
});
