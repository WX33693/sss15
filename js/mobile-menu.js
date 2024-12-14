console.log('تم تحميل ملف mobile-menu.js');

document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل الصفحة');
    
    const floatingBtn = document.querySelector('.floating-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const menuOverlay = document.querySelector('.menu-overlay');

    console.log('العناصر:', { 
        floatingBtn: !!floatingBtn, 
        mainNav: !!mainNav, 
        menuOverlay: !!menuOverlay 
    });

    // التأكد من وجود العناصر
    if (!floatingBtn || !mainNav || !menuOverlay) {
        console.error('عناصر القائمة غير موجودة');
        return;
    }

    // فتح/إغلاق القائمة عند النقر على الزر
    floatingBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('تم النقر على زر القائمة');
        mainNav.classList.toggle('show');
        menuOverlay.classList.toggle('show');
        
        // تغيير الأيقونة
        const icon = this.querySelector('i');
        if (icon) {
            if (mainNav.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });

    // إغلاق القائمة عند النقر على التعتيم
    menuOverlay.addEventListener('click', closeMenu);

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!mainNav.contains(e.target) && !floatingBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // دالة إغلاق القائمة
    function closeMenu() {
        mainNav.classList.remove('show');
        menuOverlay.classList.remove('show');
        const icon = floatingBtn.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }
});
