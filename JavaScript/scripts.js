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
      
      // CRÍTICO: Geração do link de detalhes para páginas individuais
      // Pega a primeira palavra (ex: "Caderno"), minúsculas, e adiciona .html
      const detailPage = produto.nome.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + '.html';
      
      // Geração de ID e preparo para o botão de carrinho
      const produtoId = produto.nome.replace(/\s+/g, '-').toLowerCase();
      const precoFloat = parseFloat(produto.preco.replace(',', '.')); 
      
      card.innerHTML = `
        <div class="card h-100">
          <img class="card-img-top" 
               src="${produto.imagem}" 
               alt="${produto.nome}" />
          <div class="card-body p-4 text-center">
              <h5 class="fw-bolder">${produto.nome}</h5>
              R$ ${precoParaDisplay}
          </div>
          <div class="card-footer p-4 pt-0 bg-transparent text-center">
              <a class="btn btn-outline-dark mt-auto" href="${detailPage}">Detalhes</a>
              <button class="btn btn-success mt-2" 
                      data-id="${produtoId}"
                      data-nome="${produto.nome}"
                      data-preco="${precoFloat}" 
                      data-imagem="${produto.imagem}"
                      onclick="adicionarAoCarrinho(this)">
                      Adicionar
              </button>
          </div>
        </div>
      `;

      produtosholder.appendChild(card);
    });
    
  } catch (error) {
    console.error('Erro CRÍTICO ao carregar JSON:', error);
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
