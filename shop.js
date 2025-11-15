// Funções específicas da página Shop

let allProducts = [];

// Carregar produtos
function loadProducts() {
    allProducts = getProducts();
    displayProducts(allProducts);
}

// Exibir produtos
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    
    if (products.length === 0) {
        productsGrid.innerHTML = '';
        noProducts.style.display = 'block';
        return;
    }
    
    noProducts.style.display = 'none';
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Criar card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetails(product);
    
    const stockClass = product.stock === 0 ? 'stock-out' : 
                      product.stock < 10 ? 'stock-low' : 'stock-available';
    const stockText = product.stock === 0 ? 'Fora de estoque' : 
                     product.stock < 10 ? `Apenas ${product.stock} unidades` : 
                     `${product.stock} unidades disponíveis`;
    
    const imageUrl = product.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x300?text=Sem+Imagem'">
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <div class="product-stock ${stockClass}">
                <i class="fas fa-box"></i> ${stockText}
            </div>
        </div>
    `;
    
    return card;
}

// Filtrar produtos
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filtered = allProducts;
    
    // Filtrar por categoria
    if (categoryFilter) {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filtered);
}

// Mostrar detalhes do produto
function showProductDetails(product) {
    const modal = document.getElementById('productModal');
    const detailsDiv = document.getElementById('productDetails');
    
    const imageUrl = product.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem';
    
    const stockClass = product.stock === 0 ? 'stock-out' : 
                      product.stock < 10 ? 'stock-low' : 'stock-available';
    const stockText = product.stock === 0 ? 'Fora de estoque' : 
                     product.stock < 10 ? `Apenas ${product.stock} unidades disponíveis` : 
                     `${product.stock} unidades em estoque`;
    
    detailsDiv.innerHTML = `
        <div class="product-details-content">
            <div>
                <img src="${imageUrl}" alt="${product.name}" class="product-details-image" onerror="this.src='https://via.placeholder.com/400x300?text=Sem+Imagem'">
            </div>
            <div class="product-details-info">
                <div class="product-details-category">${product.category}</div>
                <h2>${product.name}</h2>
                <div class="product-details-price">${formatCurrency(product.price)}</div>
                <div class="product-stock ${stockClass}">
                    <i class="fas fa-box"></i> ${stockText}
                </div>
                <div class="product-details-description">
                    <h3>Descrição</h3>
                    <p>${product.description}</p>
                    ${product.details ? `
                        <h3>Detalhes</h3>
                        <p>${product.details}</p>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Fechar modal de detalhes
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

// Atualizar quando produtos mudarem
window.addEventListener('productsUpdated', function() {
    loadProducts();
});