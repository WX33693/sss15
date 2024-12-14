document.addEventListener('DOMContentLoaded', () => {
    // تهيئة السلايدر
    initSlider();
    
    // تهيئة قائمة المنتجات
    initProductInteractions();
    
    // تهيئة النشرة البريدية
    initNewsletterForm();
    
    // تحديث عداد السلة عند تحميل الصفحة
    updateCartCount();
    
    // تحديث عربة التسوق عند تحميل الصفحة
    updateCartDisplay();
    
    // تحديث عداد المفضلة عند تحميل الصفحة
    updateFavoritesCount();
    checkEmptyFavorites();
    loadFavoritesFromLocalStorage();

    // تفعيل القائمة المتجاوبة
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    // تهيئة الترتيب
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProducts);
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            // تغيير أيقونة القائمة
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                navLinks.classList.remove('show');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // تهيئة أزرار أضف للسلة
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image
            };
            
            addToCart(product);
            
            // تأثير متحرك عند إضافة منتج للسلة
            this.innerHTML = '✓ تمت الإضافة';
            this.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                this.innerHTML = 'أضف للسلة';
                this.style.backgroundColor = '#e60000';
            }, 1500);
        });
    });

    // تهيئة أزرار المفضلة
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image
            };
            
            // تغيير أيقونة المفضلة
            const heartIcon = this.querySelector('i');
            if (heartIcon.classList.contains('far')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                addToFavorites(product);
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                removeFavorite(product.id);
            }
        });
    });
});

// دالة ترتيب المنتجات
function sortProducts() {
    const sortSelect = document.querySelector('.sort-select');
    const productsGrid = document.querySelector('.products-grid');
    const productCards = Array.from(document.querySelectorAll('.product-card'));

    const sortValue = sortSelect.value;

    const sortedCards = productCards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('ج.م', '').replace(',', '').trim());
        const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('ج.م', '').replace(',', '').trim());

        switch(sortValue) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'newest':
                // يمكنك إضافة منطق الترتيب حسب التاريخ هنا إذا كان لديك معلومات التاريخ
                return 0;
            case 'popular':
                // يمكنك إضافة منطق الترتيب حسب الشعبية هنا
                return 0;
            default:
                return 0;
        }
    });

    // مسح الشبكة الحالية
    productsGrid.innerHTML = '';

    // إعادة إضافة البطاقات المرتبة
    sortedCards.forEach(card => {
        productsGrid.appendChild(card);
    });
}

// دالة إضافة منتج للسلة
function addToCart(product) {
    // الحصول على السلة الحالية من التخزين المحلي
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // التحقق مما إذا كان المنتج موجود بالفعل في السلة
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        // زيادة الكمية إذا كان المنتج موجودًا بالفعل
        cart[existingProductIndex].quantity += 1;
    } else {
        // إضافة المنتج الجديد للسلة
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // حفظ السلة المحدثة في التخزين المحلي
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // تحديث عداد السلة في واجهة المستخدم
    updateCartCount();
    
    // تحديث عربة التسوق
    updateCartDisplay();
}

// دالة تحديث عداد السلة
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// دالة تحديث عرض عربة التسوق
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('subtotal');
    const totalPriceElement = document.getElementById('total-price');
    
    // مسح المحتوى الحالي
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        subtotalElement.textContent = '0.00 ج.م';
        totalPriceElement.textContent = '0.00 ج.م';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    
    // حساب المجموع الفرعي
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCost = 50;
    const totalPrice = subtotal + shippingCost;
    
    // عرض المنتجات
    cart.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="item-price">${item.price.toFixed(2)} جنيه</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="decrementQuantity(${index})">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" onchange="updateQuantity(${index}, this)">
                <button class="quantity-btn" onclick="incrementQuantity(${index})">+</button>
            </div>
            <button class="remove-item" onclick="removeItem(${index})">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        cartContainer.appendChild(cartItemElement);
    });
    
    // تحديث الأسعار
    subtotalElement.textContent = `${subtotal.toFixed(2)} ج.م`;
    totalPriceElement.textContent = `${totalPrice.toFixed(2)} ج.م`;
}

// دالة زيادة الكمية
function incrementQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index].quantity < 10) {
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// دالة تقليل الكمية
function decrementQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// دالة تحديث الكمية
function updateQuantity(index, input) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const newQuantity = parseInt(input.value);
    
    if (newQuantity >= 1 && newQuantity <= 10) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    } else {
        input.value = cart[index].quantity;
    }
}

// دالة إزالة منتج
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

// دالة تطبيق كود الخصم
function applyPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    // قائمة أكواد الخصم
    const promoCodes = {
        'WELCOME10': 0.1,  // خصم 10%
        'SUMMER20': 0.2,   // خصم 20%
        'SWEET50': 0.5     // خصم 50%
    };
    
    if (promoCodes[promoCode]) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discountAmount = subtotal * promoCodes[promoCode];
        const totalPrice = subtotal + 50 - discountAmount;
        
        document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} ج.م`;
        document.getElementById('total-price').textContent = `${totalPrice.toFixed(2)} ج.م`;
        
        alert(`تم تطبيق كود الخصم ${promoCode} بنجاح!`);
    } else {
        alert('كود الخصم غير صالح');
    }
    
    promoInput.value = '';
}

// دالة المتابعة للدفع
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('عربة التسوق فارغة');
        return;
    }
    
    // توجيه المستخدم لصفحة الدفع
    window.location.href = 'checkout.html';
}

// دالة تهيئة النشرة البريدية
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input.value) {
                alert('تم الاشتراك بنجاح! 🎉');
                input.value = '';
            }
        });
    }
}

// دالة البحث
function searchProducts(query) {
    // هنا سيتم إضافة منطق البحث عن المنتجات
    console.log('جاري البحث عن:', query);
}

// تهيئة القائمة المنسدلة
const dropdowns = document.querySelectorAll('.has-dropdown');
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.display = 'flex';
        }
    });
    
    dropdown.addEventListener('mouseleave', () => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.display = 'none';
        }
    });
});

// وظائف المفضلة المحسنة
function addToFavorites(product) {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyFavorites = document.getElementById('emptyFavorites');

    // التحقق من وجود المنتج بالفعل في المفضلة
    const existingFavorites = favoritesGrid.querySelectorAll('.favorite-item');
    const isDuplicate = Array.from(existingFavorites).some(favorite => 
        favorite.querySelector('h3').textContent === product.name
    );

    if (isDuplicate) {
        alert('هذا المنتج موجود بالفعل في المفضلة');
        return;
    }

    const favoriteItem = document.createElement('div');
    favoriteItem.classList.add('favorite-item');
    favoriteItem.innerHTML = `
        <button class="remove-favorite" onclick="removeFavorite(this)">
            <i class="fas fa-times"></i>
        </button>
        <img src="${product.image}" alt="${product.name}">
        <div class="favorite-item-details">
            <h3>${product.name}</h3>
            <p>${product.price} جنيه</p>
            <div class="favorite-actions">
                <button class="remove-favorite" onclick="removeFavorite(this)">إزالة</button>
                <button onclick="addToCart('${product.name}')">أضف للسلة</button>
            </div>
        </div>
    `;

    favoritesGrid.appendChild(favoriteItem);
    updateFavoritesCount();
    checkEmptyFavorites();
    saveFavoritesToLocalStorage();
}

function removeFavorite(button) {
    const favoriteItem = button.closest('.favorite-item');
    favoriteItem.remove();
    updateFavoritesCount();
    checkEmptyFavorites();
    saveFavoritesToLocalStorage();
}

function updateFavoritesCount() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favoritesCount = favoritesGrid.children.length;
    document.querySelector('.favorites-count').textContent = favoritesCount;
}

function checkEmptyFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyFavorites = document.getElementById('emptyFavorites');

    if (favoritesGrid.children.length === 0) {
        favoritesGrid.style.display = 'none';
        emptyFavorites.style.display = 'block';
    } else {
        favoritesGrid.style.display = 'grid';
        emptyFavorites.style.display = 'none';
    }
}

function saveFavoritesToLocalStorage() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favorites = Array.from(favoritesGrid.children).map(item => ({
        name: item.querySelector('h3').textContent,
        price: item.querySelector('p').textContent,
        image: item.querySelector('img').src
    }));
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadFavoritesFromLocalStorage() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    favorites.forEach(product => {
        const favoriteItem = document.createElement('div');
        favoriteItem.classList.add('favorite-item');
        favoriteItem.innerHTML = `
            <button class="remove-favorite" onclick="removeFavorite(this)">
                <i class="fas fa-times"></i>
            </button>
            <img src="${product.image}" alt="${product.name}">
            <div class="favorite-item-details">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <div class="favorite-actions">
                    <button class="remove-favorite" onclick="removeFavorite(this)">إزالة</button>
                    <button onclick="addToCart('${product.name}')">أضف للسلة</button>
                </div>
            </div>
        `;
        favoritesGrid.appendChild(favoriteItem);
    });

    updateFavoritesCount();
    checkEmptyFavorites();
}

// دالة تهيئة السلايدر المتقدم
function initializeSlider() {
    const slider = document.querySelector('.slider-container');
    const sliderButtons = document.querySelectorAll('.slider-btn');
    
    // مصفوفة الشرائح مع معلومات مفصلة
    const slides = [
        {
            image: 'assets/images/slider/slide1.jpg',
            title: 'تخفيضات حصرية على أجهزة المطبخ',
            description: 'استمتع بأحدث الأجهزة المنزلية بأسعار لا تقبل المنافسة',
            link: 'products.html?cat=kitchen',
            buttonText: 'تسوق الآن'
        },
        {
            image: 'assets/images/slider/slide2.jpg',
            title: 'عروض مذهلة على الأثاث',
            description: 'غير ديكور منزلك مع مجموعتنا الرائعة من قطع الأثاث',
            link: 'products.html?cat=furniture',
            buttonText: 'اكتشف العروض'
        },
        {
            image: 'assets/images/slider/slide3.jpg',
            title: 'أحدث الأجهزة الإلكترونية',
            description: 'تكنولوجيا متطورة بأسعار منافسة لم تراها من قبل',
            link: 'products.html?cat=electronics',
            buttonText: 'تصفح المنتجات'
        }
    ];

    // إنشاء الشرائح بشكل ديناميكي
    function createSlides() {
        slider.innerHTML = slides.map((slide, index) => `
            <div class="slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${slide.image}" alt="${slide.title}">
                <div class="slide-content">
                    <h2>${slide.title}</h2>
                    <p>${slide.description}</p>
                    <a href="${slide.link}" class="btn">${slide.buttonText}</a>
                </div>
            </div>
        `).join('');

        // إضافة شريط التقدم
        const progressContainer = document.createElement('div');
        progressContainer.className = 'slider-progress';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `slider-progress-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('data-index', index);
            dot.addEventListener('click', () => moveToSlide(index));
            progressContainer.appendChild(dot);
        });
        slider.parentElement.appendChild(progressContainer);
    }

    // التنقل بين الشرائح
    function moveToSlide(index) {
        const currentSlide = slider.querySelector('.slide.active');
        const currentProgressDot = document.querySelector('.slider-progress-dot.active');
        const nextSlide = slider.querySelector(`.slide[data-index="${index}"]`);
        const nextProgressDot = document.querySelector(`.slider-progress-dot[data-index="${index}"]`);

        // إزالة الكلاس النشط من العناصر الحالية
        currentSlide.classList.remove('active');
        currentProgressDot.classList.remove('active');

        // إضافة الكلاس النشط للعناصر الجديدة
        nextSlide.classList.add('active');
        nextProgressDot.classList.add('active');
    }

    // التنقل التلقائي
    function autoSlide() {
        const currentSlide = slider.querySelector('.slide.active');
        const currentIndex = parseInt(currentSlide.dataset.index);
        const nextIndex = (currentIndex + 1) % slides.length;
        moveToSlide(nextIndex);
    }

    // إضافة أزرار التنقل
    function addNavigationButtons() {
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');

        prevBtn.addEventListener('click', () => {
            const currentSlide = slider.querySelector('.slide.active');
            const currentIndex = parseInt(currentSlide.dataset.index);
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });

        nextBtn.addEventListener('click', () => {
            const currentSlide = slider.querySelector('.slide.active');
            const currentIndex = parseInt(currentSlide.dataset.index);
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });
    }

    // تهيئة السلايدر
    createSlides();
    addNavigationButtons();

    // بدء التمرير التلقائي كل 5 ثوانٍ
    let autoSlideInterval = setInterval(autoSlide, 5000);

    // إيقاف التمرير التلقائي عند التحويم
    const sliderContainer = document.querySelector('.main-slider');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(autoSlide, 5000);
    });
}

// تشغيل دالة تهيئة السلايدر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeSlider);