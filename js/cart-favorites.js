// إدارة السلة والمفضلة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة السلة والمفضلة
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }

    // تحديث العدادات
    updateCounters();

    // تفعيل الأزرار
    initializeButtons();
});

function initializeButtons() {
    // أزرار إضافة للسلة
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.offer-card, .product-card');
            const product = {
                id: Date.now().toString(),
                name: card.querySelector('.offer-title, .product-title').textContent,
                price: extractPrice(card.querySelector('.current, .price').textContent),
                image: card.querySelector('img').src,
                quantity: 1
            };
            
            addToCart(product);
        });
    });

    // أزرار إضافة للمفضلة
    document.querySelectorAll('.add-to-favorites').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.offer-card, .product-card');
            const product = {
                id: Date.now().toString(),
                name: card.querySelector('.offer-title, .product-title').textContent,
                price: extractPrice(card.querySelector('.current, .price').textContent),
                image: card.querySelector('img').src
            };
            
            toggleFavorite(product, this);
        });
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // البحث عن المنتج في السلة
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCounters();
    showNotification('تم إضافة المنتج للسلة');
}

function toggleFavorite(product, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const icon = button.querySelector('i');
    
    // البحث عن المنتج في المفضلة بدقة أكبر
    const index = favorites.findIndex(item => 
        item.name === product.name && 
        item.price === product.price && 
        item.image === product.image
    );
    
    if (index === -1) {
        // إضافة للمفضلة
        favorites.push(product);
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#e60000';
        showNotification('تم إضافة المنتج للمفضلة');
    } else {
        // إزالة من المفضلة
        favorites.splice(index, 1);
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '#666';
        showNotification('تم إزالة المنتج من المفضلة');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateCounters();
    
    // تحديث الصفحة إذا كنا في صفحة المفضلة
    if (window.location.pathname.includes('favorites.html')) {
        displayFavorites();
    }
}

function updateCounters() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // تحديث عداد السلة
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'block' : 'none';
    }
    
    // تحديث عداد المفضلة
    const favBadge = document.querySelector('.favorites-badge');
    if (favBadge) {
        favBadge.textContent = favorites.length;
        favBadge.style.display = favorites.length > 0 ? 'block' : 'none';
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function extractPrice(priceText) {
    return priceText.replace(/[^\d.]/g, '');
}

// تحديث حالة أيقونات المفضلة عند تحميل الصفحة
function updateFavoriteIcons() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.querySelectorAll('.add-to-favorites').forEach(button => {
        const card = button.closest('.offer-card, .product-card');
        const productName = card.querySelector('.offer-title, .product-title').textContent;
        const isFavorite = favorites.some(item => item.name === productName);
        const icon = button.querySelector('i');
        
        if (isFavorite) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#e60000';
        }
    });
}

// تحديث الأيقونات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updateFavoriteIcons);
