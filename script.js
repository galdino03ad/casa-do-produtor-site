// Sistema de autenticação e gerenciamento de produtos
const AUTH_USER = 'Casadoprodutor';
const AUTH_PASSWORD = 'casa_do_produtor0510';

// Funções de Modal de Login
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('loginError').textContent = '';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginForm').reset();
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const productModal = document.getElementById('productModal');
    const editModal = document.getElementById('editModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === productModal) {
        closeProductModal();
    }
    if (event.target === editModal) {
        closeEditModal();
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    if (username === AUTH_USER && password === AUTH_PASSWORD) {
        // Login bem-sucedido
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('loginTime', Date.now());
        window.location.href = 'admin.html';
    } else {
        errorElement.textContent = 'Usuário ou senha incorretos!';
    }
}

// Handle Logout
function handleLogout() {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('loginTime');
    window.location.href = 'index.html';
}

// Verificar autenticação
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    const loginTime = sessionStorage.getItem('loginTime');
    
    // Verificar se está autenticado e se a sessão não expirou (24 horas)
    if (!isAuthenticated || !loginTime) {
        return false;
    }
    
    const currentTime = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas
    
    if (currentTime - loginTime > sessionDuration) {
        handleLogout();
        return false;
    }
    
    return true;
}

// Gerenciamento de Produtos (LocalStorage como banco de dados sincronizado)
function getProducts() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
}

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
    // Disparar evento para sincronizar entre abas
    window.dispatchEvent(new Event('productsUpdated'));
}

function addProduct(product) {
    const products = getProducts();
    product.id = Date.now().toString();
    products.push(product);
    saveProducts(products);
    return product;
}

function updateProduct(id, updatedProduct) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        saveProducts(products);
        return true;
    }
    return false;
}

function deleteProduct(id) {
    const products = getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    saveProducts(filteredProducts);
}

// Formatação de moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Inicializar produtos de exemplo (apenas na primeira vez)
function initializeDefaultProducts() {
    const products = getProducts();
    if (products.length === 0) {
        const defaultProducts = [
            {
                id: '1',
                name: 'Fertilizante NPK 10-10-10',
                category: 'Fertilizantes',
                price: 89.90,
                stock: 50,
                description: 'Fertilizante balanceado ideal para diversas culturas',
                image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
                details: 'Composição NPK balanceada. Indicado para fase vegetativa. Embalagem de 25kg.'
            },
            {
                id: '2',
                name: 'Semente de Milho Híbrido',
                category: 'Sementes',
                price: 450.00,
                stock: 30,
                description: 'Semente de milho de alta produtividade',
                image: 'https://images.unsplash.com/photo-1605024662913-cf1c0e1f1d58?w=400',
                details: 'Alto potencial produtivo. Resistente a doenças. Ciclo de 120 dias.'
            },
            {
                id: '3',
                name: 'Herbicida Glifosato',
                category: 'Defensivos',
                price: 125.00,
                stock: 15,
                description: 'Herbicida não seletivo de ação sistêmica',
                image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
                details: 'Controle eficaz de plantas daninhas. Concentração 480g/L. Embalagem 1L.'
            }
        ];
        saveProducts(defaultProducts);
    }
}

// Sincronização entre dispositivos (usando evento de storage)
window.addEventListener('storage', function(e) {
    if (e.key === 'products') {
        // Atualizar a página quando produtos forem modificados em outra aba/dispositivo
        location.reload();
    }
});

// Sincronização na mesma aba
window.addEventListener('productsUpdated', function() {
    // Verificar qual página está aberta e atualizar
    if (window.location.pathname.includes('shop.html')) {
        if (typeof loadProducts === 'function') {
            loadProducts();
        }
    } else if (window.location.pathname.includes('admin.html')) {
        if (typeof loadAdminProducts === 'function') {
            loadAdminProducts();
            updateStats();
        }
    }
});

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultProducts();
});