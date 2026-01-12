# دليل استضافة موقع Redex على GitHub

## 1. إنشاء مستودع (Repository) جديد
1. اذهب إلى [GitHub.com](https://github.com) وسجل الدخول.
2. اضغط على علامة **+** في الزاوية العلوية اليمنى واختر **New repository**.
3. سمِّ المستودع باسم مناسب (مثلاً `redex-platform`).
4. تأكد من اختيار **Public**.
5. لا تقم بتفعيل "Add a README file" (لأننا لدينا ملفات بالفعل).
6. اضغط **Create repository**.

## 2. رفع الملفات
لقد قكت بتهيئة المستودع محلياً لك. الآن تحتاج لربطه بـ GitHub ورفع الملفات.
انسخ الأوامر التالية (التي ستظهر لك في صفحة GitHub بعد إنشاء المستودع) ونفذها في موجز الأوامر (Command Prompt):

```bash
git remote add origin https://github.com/YOUR_USERNAME/redex-platform.git
git branch -M main
git push -u origin main
```

*استبدل `YOUR_USERNAME` باسم المستخدم الخاص بك.*

## 3. تفعيل GitHub Pages
1. بعد رفع الملفات، اذهب إلى تبويب **Settings** في مستودعك على GitHub.
2. من القائمة الجانبية اليسرى، اختر **Pages**.
3. في قسم **Build and deployment** > **Source**، اختر **Deploy from a branch**.
4. تحت **Branch**، اختر `main` واضغط **Save**.
5. انتظر قليلاً (حوالي دقيقة)، وستظهر لك رسالة برابط موقعك الجديد! (مثلاً `https://yourname.github.io/redex-platform/`).

## ملاحظة هامة
تأكد من أنك قمت بإنشاء قاعدة البيانات في Supabase (كما هو موضح في `SETUP_SUPABASE.md`) وأنك وضعت المفاتيح الصحيحة في `scripts/api.js` لكي يعمل الموقع بشكل صحيح أونلاين.
