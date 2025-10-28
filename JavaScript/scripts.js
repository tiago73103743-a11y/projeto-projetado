// js/scripts.js
// FUNÇÕES DE CARRINHO SÃO DEFINIDAS EM 'carrinho.js'

async function carregarJSON(regexfilter) {
  
  try {
    let regex = new RegExp(regexfilter, 'i');

    // CAMINHO CORRIGIDO: Assume que data.json está em /LocalStorage/data.json
    const response = await fetch('../LocalStorage/data.json'); 

    if (!response.ok) {
        throw new Error(`Status ${response.status}. Verifique se o Live Server está ativo e o caminho.`);
    }

    const data = await response.json();
    
    // Filtra os produtos
    const dataFiltered = data.produtos.filter(produto => {
        return regex.test(produto.nome);
    });

    const produtosholder = document.getElementById('produtos-holder');
    if (!produtosholder) return;

    produtosholder.innerHTML = ''; 

    dataFiltered.forEach(produto => {
      const card = document.createElement('div');
      card.classList.add('col', 'mb-5');

      const precoParaDisplay = produto.preco;
      
      // 1. CORREÇÃO DE LINK: Usa a URL correta diretamente do data.json
      const detailPage = produto.detailPage;
      
      // Geração de ID e preparo para o botão de carrinho
      const precoFloat = parseFloat(produto.preco);
      
      const cardHTML = `
        <div class="card h-100">
            <a href="${detailPage}"> 
              <img class="card-img-top" src="${produto.imagem}" alt="${produto.nome}" />
            </a>

            <div class="card-body p-4">
                <div class="text-center">
                    <h5 class="fw-bolder">${produto.nome}</h5>
                    R$ ${precoParaDisplay.replace('.', ',')}
                </div>
            </div>
            
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center">
                    <div class="d-flex justify-content-center">
                        <a class="btn btn-outline-dark mt-auto me-2" href="${detailPage}">Ver detalhes</a>
                        
                        <button class="btn btn-primary flex-shrink-0" type="button" 
                                data-id="${produto.id}"
                                data-nome="${produto.nome}"
                                data-preco="${precoFloat}" 
                                data-imagem="${produto.imagem}"
                                onclick="adicionarAoCarrinho(this)">
                            <i class="bi-cart-fill me-1"></i>
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        </div>
      `;

      card.innerHTML = cardHTML;
      produtosholder.appendChild(card);
    });

    // Se não houver produtos, exibe mensagem
    if (dataFiltered.length === 0) {
        produtosholder.innerHTML = `<p class="text-center">Nenhum produto encontrado com o termo "${regexfilter}".</p>`;
    }

  } catch (error) {
    console.error('Error ao carregar JSON:', error);
    const produtosholder = document.getElementById('produtos-holder');
    if(produtosholder) {
        produtosholder.innerHTML = `<p class="text-center text-danger">Falha ao carregar os produtos. Verifique o Live Server e o caminho: <b>../LocalStorage/data.json</b>. Erro: ${error.message}</p>`;
    }
  }
}

// =======================================================
// INICIALIZAÇÃO E LÓGICA DE BUSCA
// =======================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Carrega o contador (função definida em carrinho.js)
    if (typeof updateCartCounterDisplay === 'function') {
        updateCartCounterDisplay();
    }

    // Carrega produtos apenas se estiver na página principal (index.html)
    if (document.getElementById('produtos-holder')) {
         carregarJSON('');
    }

    // Lógica para pesquisa
    const searchbarElement = document.getElementById('search-bar');
    if (searchbarElement) { 
        searchbarElement.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                const searchValue = this.value;
                carregarJSON(searchValue);
            }
        });
        
        const searchButton = document.querySelector('.input-group-text');
        if (searchButton) {
             searchButton.addEventListener('click', function() {
                const searchValue = searchbarElement.value;
                carregarJSON(searchValue);
            });
        }
    }
});
