const axios = require('axios');

// ====== RAHHALAH BRAND KNOWLEDGE ======
const SYSTEM_PROMPT = `أنت مساعد ودود واحترافي لمتجر "رحالة" (Rahhalah)، متجر مصري متخصص في بيع الهوديز (Hoodies) الأنيقة بجودة عالية.

معلومات المتجر التي يجب أن تعرفها:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏪 اسم المتجر: رحالة (Rahhalah)
📦 التخصص: الهوديز (Hoodies) - نعم فقط الهوديز! منتجات عالية الجودة بتصاميم عصرية وأنيقة
💰 نطاق الأسعار: تقريباً من 400 جنيه لـ 1200 جنيه حسب الموديل والخامة
🎨 الألوان المتاحة: أسود، كحلي، رمادي، كريمي، وألوان موسمية متنوعة
📏 المقاسات: S, M, L, XL, XXL
🚚 الشحن: متاح لجميع محافظات مصر (2-5 أيام عمل) - رسوم شحن تبدأ من 60 جنيه
✅ الجودة: خامات قطنية عالية الجودة مع بطانة ناعمة للراحة القصوى
💳 الدفع: كاش عند الاستلام أو أونلاين
🔄 الاسترجاع: خلال 14 يوم من تاريخ الاستلام (شرط أن يكون المنتج بحالته الأصلية)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

تعليمات مهمة:
1. كن ودوداً وحماساً ولطيفاً دايماً 😊
2. رد بالعربية دايماً إلا لو العميل بدأ بلغة تانية
3. استخدم الإيموجي بشكل معقول لجعل المحادثة أكثر حيوية
4. لو حد سأل عن منتج غير الهوديز، قوله بلطف إن رحالة متخصصة في الهوديز فقط
5. لو السؤال مش عن المتجر أو المنتجات، حول بلطف الموضوع لمساعدته في التسوق
6. شجع العميل على إتمام الشراء بأسلوب غير ضاغط
7. لو سألك عن الأسعار أو المقاسات، أعطه المعلومات المتاحة بوضوح`;

exports.getAIResponse = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required' });
    }

    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            // Friendly fallback without API key
            const fallbackReplies = [
                'أهلاً وسهلاً بك في رحالة! 😊 نحن متخصصون في أجمل الهوديز بمصر. كيف يمكنني مساعدتك؟',
                'مرحباً! 👋 في رحالة عندنا هوديز بجودة عالية وأسعار مناسبة. تفضل اسأل عن أي حاجة!',
                'هلا هلا! ✨ يسعدني مساعدتك. عندنا هوديز للرجال والسيدات بمقاسات واسعة. أيه اللي بتدور عليه؟'
            ];
            const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
            return res.status(200).json({ success: true, reply: randomReply });
        }

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'meta-llama/llama-3.3-70b-instruct', // Very powerful free model with excellent capabilities
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: message }
            ],
            max_tokens: 350,
            temperature: 0.8
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
                'X-Title': 'Rahhalah Hoodies Store',
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });

        const reply = response.data.choices[0].message.content;
        res.status(200).json({ success: true, reply });

    } catch (error) {
        console.error('AI Controller Error:', error.response?.data || error.message);
        // Friendly error fallback
        res.status(200).json({
            success: true,
            reply: 'عذراً، فيه مشكلة صغيرة عندي دلوقتي 😅 بس أنا هنا للمساعدة! تقدر تتصفح منتجاتنا الجميلة من الهوديز مباشرة، أو ابعتلنا رسالة وهنرد عليك في أقرب وقت! 💛'
        });
    }
};
