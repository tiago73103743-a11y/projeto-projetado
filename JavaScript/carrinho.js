// =======================================================
// MÓDULO 1: MANIPULAÇÃO DE DADOS (LOCAL STORAGE)
// =======================================================

let carrinho = [];

function carregarCarrinho() {
    const carrinhoJSON = localStorage.getItem('carrinhoUniversoEscolar');
    if (carrinhoJSON) {
        carrinho = JSON.parse(carrinhoJSON);
    }
}

function salvarCarrinho() {
    localStorage.setItem('carrinhoUniversoEscolar', JSON.stringify(carrinho));
}


// =======================================================
// MÓDULO 2: LÓGICA DE NEGÓCIO
// =======================================================

function adicionarAoCarrinho(elementoBotao) {
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

function removerItem(itemId) {
    carrinho = carrinho.filter(item => item.id !== itemId);
    salvarCarrinho();
    
    if (document.getElementById('tabela-carrinho')) {
        renderizarCarrinho();
    } else {
        atualizarContador();
    }
}

function atualizarQuantidade(itemId, novaQtd) {
    const item = carrinho.find(item => item.id === itemId);
    const quantidade = parseInt(novaQtd);

    if (item && quantidade > 0) {
        item.quantidade = quantidade;
    } else if (item && quantidade <= 0) {
        removerItem(itemId);
        return;
    }

    salvarCarrinho();
    if (document.getElementById('tabela-carrinho')) {
        renderizarCarrinho();
    }
}


// =======================================================
// MÓDULO 3: RENDERIZAÇÃO DA UI (Interface do Usuário)
// =======================================================

function atualizarContador() {
    const contadorElemento = document.getElementById('carrinho-contador');
    if (contadorElemento) {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        contadorElemento.textContent = totalItens;
    }
}

function renderizarCarrinho() {
    const corpoTabela = document.getElementById('carrinho-corpo-tabela');
    const totalElemento = document.getElementById('carrinho-total');

    if (!corpoTabela || !totalElemento) return; 

    corpoTabela.innerHTML = ''; 

    let subtotalGeral = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        subtotalGeral += subtotal;

        const linha = `
            <tr>
                <td><img src="${item.imagem}" alt="${item.nome}" style="width: 50px;"></td>
                <td>${item.nome}</td>
                <td>R$ ${item.preco.toFixed(2).replace('.', ',')}</td>
                <td>
                    <input type="number" value="${item.quantidade}" min="1" 
                           onchange="atualizarQuantidade('${item.id}', this.value)" 
                           style="width: 60px;">
                </td>
                <td>R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
                <td><button onclick="removerItem('${item.id}')" class="btn btn-sm btn-danger">Remover</button></td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });

    totalElemento.textContent = `R$ ${subtotalGeral.toFixed(2).replace('.', ',')}`;
    atualizarContador(); 
}


// =======================================================
// INICIALIZAÇÃO
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    atualizarContador();
    
    if (document.getElementById('tabela-carrinho')) {
        renderizarCarrinho();
    }
});
