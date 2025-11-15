// Funções específicas da página Admin

// Verificar autenticação ao carregar
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) {
        alert('Acesso negado! Faça login para acessar o painel administrativo.');
        window.location.href = 'index.html';
        return;
    }
    
    loadAdminProducts();
    updateStats();
});

// Atualizar estatísticas
function updateStats() {
    const products = getProducts();
    const categories = [...new Set(products.map(p => p.category))];
    
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalCategories').textContent = categories.length;
}

// Carregar produtos no painel admin
function loadAdminProducts() {
    const products = getProducts();
    const listDiv = document.getElementById('adminProductsList');
    const noProducts = document.getElementById('noAdminProducts');
    
    if (products.length === 0) {
        listDiv.innerHTML = '';
        noProducts.style.display = 'block';
        return;
    }
    
    noProducts.style.display = 'none';
    listDiv.innerHTML = '';
    
    products.forEach(product => {
        const item = createAdminProductItem(product);
        listDiv.appendChild(item);
    });
}

// Criar item de produto para admin
function createAdminProductItem(product) {
    const item = document.createElement('div');
    item.className = 'admin-product-item';
    
    const imageUrl = product.image || 'https://via.placeholder.com/80?text=Sem+Imagem';
    
    item.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="admin-product-image" onerror="this.src='https://via.placeholder.com/80?text=Sem+Imagem'">
        <div class="admin-product-info">
            <h3>${product.name}</h3>
            <p><strong>Categoria:</strong> ${product.category}</p>
            <p><strong>Preço:</strong> ${formatCurrency(product.price)}</p>
            <p><strong>Estoque:</strong> ${product.stock} unidades</p>
        </div>
        <div class="admin-product-actions">
            <button class="btn-edit" onclick="editProduct('${product.id}')">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn-delete" onclick="confirmDeleteProduct('${product.id}', '${product.name}')">
                <i class="fas fa-trash"></i> Excluir
            </button>
        </div>
    `;
    
    return item;
}

// Filtrar produtos no admin
function filterAdminProducts() {
    const searchTerm = document.getElementById('adminSearchInput').value.toLowerCase();
    const products = getProducts();
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
    
    const listDiv = document.getElementById('adminProductsList');
    const noProducts = document.getElementById('noAdminProducts');
    
    if (filtered.length === 0) {
        listDiv.innerHTML = '';
        noProducts.style.display = 'block';
        noProducts.querySelector('p').textContent = 'Nenhum produto encontrado';
        return;
    }
    
    noProducts.style.display = 'none';
    listDiv.innerHTML = '';
    
    filtered.forEach(product => {
        const item = createAdminProductItem(product);
        listDiv.appendChild(item);
    });
}

// Cadastrar produto
function handleProductSubmit(event) {
    event.preventDefault();
    
    const product = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value,
        details: document.getElementById('productDetails').value
    };
    
    addProduct(product);
    
    // Limpar formulário
    document.getElementById('productForm').reset();
    
    // Atualizar lista e estatísticas
    loadAdminProducts();
    updateStats();
    
    // Mostrar mensagem de sucesso
    alert('Produto cadastrado com sucesso!');
    
    // Scroll para a lista de produtos
    document.getElementById('adminProductsList').scrollIntoView({ behavior: 'smooth' });
}

// Editar produto
function editProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) return;
    
    // Preencher modal de edição
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductImage').value = product.image || '';
    document.getElementById('editProductDetails').value = product.details || '';
    
    // Mostrar modal
    document.getElementById('editModal').style.display = 'block';
}

// Fechar modal de edição
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('editForm').reset();
}

// Salvar edição
function handleEditSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('editProductId').value;
    const updatedProduct = {
        name: document.getElementById('editProductName').value,
        category: document.getElementById('editProductCategory').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        stock: parseInt(document.getElementById('editProductStock').value),
        description: document.getElementById('editProductDescription').value,
        image: document.getElementById('editProductImage').value,
        details: document.getElementById('editProductDetails').value
    };
    
    if (updateProduct(id, updatedProduct)) {
        closeEditModal();
        loadAdminProducts();
        updateStats();
        alert('Produto atualizado com sucesso!');
    } else {
        alert('Erro ao atualizar produto!');
    }
}

// Confirmar exclusão
function confirmDeleteProduct(id, name) {
    if (confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
        deleteProduct(id);
        loadAdminProducts();
        updateStats();
        alert('Produto excluído com sucesso!');
    }
}

// Atualizar quando produtos mudarem
window.addEventListener('productsUpdated', function() {
    loadAdminProducts();
    updateStats();
});