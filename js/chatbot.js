document.addEventListener('DOMContentLoaded', function() {
    const chatBot = document.querySelector('.chat-bot');
    const chatToggle = document.querySelector('.chat-bot-toggle');
    const chatContainer = document.querySelector('.chat-container');
    const closeChat = document.querySelector('.close-chat');
    const messageInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-message');
    const messagesContainer = document.querySelector('.chat-messages');

    // قاعدة بيانات متقدمة للردود
    const responses = {
        // الأقسام والمنتجات
        'مطبخ': 'في قسم المطبخ لدينا: ثلاجات، غسالات أطباق، أفران، ميكروويف، خلاطات، وأدوات مطبخ متنوعة. هل تريد معرفة المزيد عن منتج معين؟',
        'غرفة_نوم': 'في قسم غرف النوم لدينا: أسرّة بمقاسات مختلفة، خزائن ملابس، تسريحات، وطاولات جانبية. ما الذي يهمك منها؟',
        'صالة': 'في قسم الصالة نوفر: كنب، طاولات، مكتبات، وحدات تلفاز، وديكورات متنوعة. هل تريد معرفة أسعار منتج معين؟',
        'حمام': 'قسم الحمام يشمل: أطقم حمام كاملة، مغاسل، خزائن، مرايا، وإكسسوارات. هل ترغب في معرفة العروض الحالية؟',

        // الأسعار والعروض
        'سعر': 'يمكنني مساعدتك بمعرفة الأسعار. هل تبحث عن منتج معين؟ أخبرني ما هو وسأخبرك بسعره وأي عروض متوفرة عليه.',
        'عروض': 'لدينا عروض مميزة هذا الأسبوع:\n- خصم 30% على جميع الأجهزة المنزلية\n- خصم 25% على أطقم الصالة\n- خصم 40% على إكسسوارات المنزل\nما يهمك من هذه العروض؟',
        'خصم': 'نعم، لدينا خصومات حالية تصل إلى 50%! هل تريد معرفة الخصومات على قسم معين؟',
        
        // الشحن والتوصيل
        'توصيل': 'نوفر خدمة توصيل مجانية للطلبات فوق 1000 جنيه. التوصيل يستغرق 2-3 أيام عمل. هل تريد تتبع طلبك؟',
        'شحن': 'الشحن متوفر لجميع المحافظات! هل تريد معرفة تكلفة الشحن لمنطقتك؟',
        
        // خدمة العملاء
        'مشكلة': 'أنا آسف لسماع ذلك. هل يمكنك إخباري بالمزيد عن المشكلة؟ سأحاول مساعدتك أو توجيهك لخدمة العملاء.',
        'شكوى': 'نأسف لأي إزعاج! يمكنك التواصل مع خدمة العملاء على الرقم 19XXX أو إرسال شكواك على البريد الإلكتروني support@sweethome.com',
        'استبدال': 'نعم، لدينا سياسة استبدال خلال 14 يوم من الشراء. هل تريد معرفة التفاصيل؟',
        
        // الضمان
        'ضمان': 'جميع منتجاتنا تأتي مع ضمان:\n- الأجهزة المنزلية: 3 سنوات\n- الأثاث: سنة\n- الإكسسوارات: 6 أشهر\nهل تريد معرفة المزيد؟',
        
        // الدفع
        'دفع': 'نقبل جميع طرق الدفع:\n- كاش عند الاستلام\n- بطاقات ائتمان\n- محافظ إلكترونية\nما هي طريقة الدفع المفضلة لديك؟',
        
        // رد افتراضي ذكي
        'default': 'عذراً، لم أفهم طلبك بشكل كامل. هل يمكنك توضيح ما تبحث عنه؟ يمكنني مساعدتك في:\n- معرفة المنتجات والأسعار\n- العروض والخصومات\n- الشحن والتوصيل\n- خدمة العملاء والضمان'
    };

    // فتح/إغلاق المحادثة
    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('show');
    });

    closeChat.addEventListener('click', () => {
        chatContainer.classList.remove('show');
    });

    // تحليل الرسالة وإيجاد أفضل رد
    function findBestResponse(message) {
        message = message.trim().toLowerCase();
        
        // البحث عن أفضل تطابق
        let bestMatch = 'default';
        let maxMatches = 0;
        
        for (let key in responses) {
            const keywords = key.split('_');
            let matches = 0;
            
            keywords.forEach(keyword => {
                if (message.includes(keyword)) {
                    matches++;
                }
            });
            
            if (matches > maxMatches) {
                maxMatches = matches;
                bestMatch = key;
            }
        }
        
        return responses[bestMatch];
    }

    // إرسال رسالة
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // إضافة رسالة المستخدم
        addMessage(message, 'user');
        messageInput.value = '';

        // إظهار أن البوت يكتب
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot', 'typing');
        typingDiv.textContent = '...';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // إيجاد الرد المناسب بعد تأخير قصير
        setTimeout(() => {
            typingDiv.remove();
            const response = findBestResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }

    // إضافة رسالة للمحادثة
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // إرسال الرسالة عند الضغط على الزر
    sendButton.addEventListener('click', sendMessage);

    // إرسال الرسالة عند الضغط على Enter
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
